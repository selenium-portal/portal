'use strict';

var TestCase       = require('./lib/Test'),
    cutil          = require('./lib/util'),
    decorateDriver = require('./lib/driverDecorator'),
    moduleLoader   = require('./lib/moduleLoader'),
    pageLoader     = require('./lib/pageLoader'),
    testLoader     = require('./lib/testLoader'),
    webdriver      = require('selenium-webdriver'),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    util           = require('util'),
    EventEmitter   = require('events').EventEmitter,
    fs             = require('fs'),
    path           = require('path');

/**
 * Portal Application Object
 * @class Portal
 * @constructor
 * @param {array} argv command line arguments
 */
function Portal(argv) {
  EventEmitter.call(this);
  this.argv                = argv;
  this.errorOut            = this.errorOut.bind(this);
  this.failedTests         = [];
}

util.inherits(Portal, EventEmitter);

/**
 * Initialize Portal
 */
Portal.prototype.init = function () {
  try {
    this.configPath  = path.dirname(path.resolve(process.cwd(), process.env.config));
    this.config      = require(path.resolve(process.cwd(), process.env.config));
    this.env         = this.config.env[process.env.env];
    this.urls        = this.config.urls || {};
  } catch (e) {
    console.error(e);
    console.error('Usage: `config=config.json env=dev', this.argv[0], this.argv[1], 'testpaths');
    process.exit(1);
  }

  if (!this.env) {
    console.error('Unable to load environment', process.env.env);
    console.error('Usage: `config=config.json env=dev', this.argv[0], this.argv[1], 'testpaths');
    process.exit(1);
  }

  // Load modules
  this.modules = this.loadModules(this.config.modules);

  // Load pages
  this.pages = this.loadPages(this.config.pages);

  // Load Tests
  this.testQueue = this.loadTests(this.argv.slice(2));

  // Create reporters
  this.reporters = this.startReporters(this.config.reporters);

  webdriver.promise.controlFlow().on('uncaughtException', this.errorOut.bind(this, 'uncaught'));
  return this.startLocalServer().then(this.runTests.bind(this), this.errorOut.bind(this, 'caught'));
};

/**
 * @method loadTests
 */
Portal.prototype.loadTests = function (testPaths) {
  return testLoader.load(this, process.cwd(), testPaths);
};

/**
 * @method loadModules
 */
Portal.prototype.loadModules = function (modulesConfig) {
  return moduleLoader.load(this, this.configPath, modulesConfig);
};

/**
 * @method loadPages
 */
Portal.prototype.loadPages = function (pagesConfig) {
  pagesConfig     = pagesConfig || {};
  return pageLoader.load(this, this.configPath, pagesConfig);
};

/**
 * Start Reporters
 * @param {config} reporter config
 */
Portal.prototype.startReporters = function (config) {
  var reporters = [];

  config = config || ['./lib/reporters/console'];
  config.forEach(function (reporter) {
    var Reporter = require(reporter);
    reporters.push(new Reporter(this));
  }, this);

  return reporters;
};

/**
 * Catch errors and emit error event which reporters listen to
 */
Portal.prototype.errorOut = function (type, err) {
  console.log(err);
  console.log(err.stack);
  if (this.activeTest) {
    this.activeTest.fail(err);
    this.emit('test:failed', this.activeTest, err);
    this.emit('test:end', this.activeTest);
    this.emit('testrun:end');
  } else {
    this.emit('error:unknown', err); 
  }

  this.stopLocalServer();

};

/**
 * Run all tests
 */
Portal.prototype.runTests = function () {
  this.emit('testrun:start');
  this.runQueue(this.testQueue);
};

/**
 * Create selenium driver with current settings
 */
Portal.prototype.createDriver = function () {
  var driver = new webdriver.Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(webdriver.Capabilities.phantomjs()
      .set('phantomjs.binary.path', path.resolve(__dirname, 'node_modules', 'phantomjs', 'bin', 'phantomjs'))
      .set('phantomjs.viewportSize', { width: 1024, height: 800 })
    )
    .build();

  return decorateDriver(driver);
};

/**
 * Run queue of tests, serially
 * @param {array} queue tests
 */
Portal.prototype.runQueue = function (queue) {
  var test = queue[0];
  queue = queue.slice(1);

  if (test) {
    test.initialize();

    this.emit('test:start', test);
    this.activeDriver = test.driver;
    this.activeTest   = test;

    test.run()
      .then(test.driver.quit)
      .then(this.testPassed.bind(this, test, queue), this.testFailed.bind(this, test, queue))
      .then(null, this.errorOut.bind(this, 'caught'))
      .then(this.runQueue.bind(this, queue));
  } else {
    this.emit('testrun:end');
    this.stopLocalServer();
  }
};

/**
 * @method testPassed
 * @param {TestCase} test which just passed
 * @param {Array} remainingTests remaining tests
 */
Portal.prototype.testPassed = function (test, remainingTests) {
  this.emit('test:passed', test);
  this.emit('test:end', test);
};

/**
 * @method testFailed
 * @param {TestCase} test which just failed
 * @param {Array} remainingTests remaining tests
 * @param {Error} failure error object
 */
Portal.prototype.testFailed = function (test, remainingTests, failure) {
  console.log('Portal.prototype.testFailed');
  console.log(failure.stack);
  this.failedTests.push(test);
  test.fail(failure);
  this.emit('test:failed', test, failure);
  this.screenshot();
};

/**
 * Run the application
 */
Portal.prototype.run = function () {
  this.init();
};

/**
 * Shutdown the local selenium server
 */
Portal.prototype.stopLocalServer = function () {
  var exitCode = this.failedTests.length ? 1 : 0;

  return this.server.stop().then(function () {
    process.exit(exitCode);
  });
};

/**
 * Start the local selenium server
 */
Portal.prototype.startLocalServer = function () {
  var jarPath = path.resolve(__dirname, 'bin', 'selenium', 'selenium-server-standalone-2.35.0.jar');
  this.server = new SeleniumServer(jarPath, {port:4444});
  return this.server.start();
};

/**
 * Take a screenshot
 */
Portal.prototype.screenshot = function (driver, filename) {
  driver.takeScreenshot().then(function (data) {
    fs.writeFileSync(filename, data, 'base64');
    this.emit('screenshot:saved', filename);
  }.bind(this));
};

module.exports = Portal;
