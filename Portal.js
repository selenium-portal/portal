'use strict';

var TestCase       = require('./lib/TestCase'),
    cutil          = require('./lib/util'),
    decorateDriver = require('./lib/driverDecorator'),
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
    this.config = require(path.resolve(process.cwd(), process.env.config));
    this.env    = this.config.env[process.env.env];
    this.pages  = this.config.pages;
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

  // Create reporters
  this.reporters = this.startReporters(this.config.reporters);

  webdriver.promise.controlFlow().on('uncaughtException', this.errorOut.bind(this, 'uncaught'));
  return this.startLocalServer().then(this.runTests.bind(this), this.errorOut.bind(this, 'caught'));
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
  this.emit('failure', err);
  this.stopLocalServer();
};

/**
 * Run all tests
 */
Portal.prototype.runTests = function () {
  this.emit('testrun:start');
  this.testQueue = this.loadTests(this.argv.slice(2));
  this.runQueue(this.testQueue);
};

/**
 * Create selenium driver with current settings
 */
Portal.prototype.createDriver = function () {
  var driver = new webdriver.Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(webdriver.Capabilities.phantomjs().set(
      'phantomjs.binary.path', path.resolve(__dirname, 'node_modules', 'phantomjs', 'bin', 'phantomjs')))
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
    this.emit('testcase:start', test.name, test.description);
    this.lastDriver  =  test.driver = this.createDriver();
    test.driver.quit = test.driver.quit.bind(test.driver);
    test.env         = this.env;
    test.pages       = this.pages;

    test.run()
      .then(test.driver.quit)
      .then(this.testPassed.bind(this, test, queue), this.testFailed.bind(this, test, queue))
      .then(null, this.errorOut.bind(this, 'caught'));
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
  this.emit('testcase:passed', test);
  this.runQueue(remainingTests);
};

/**
 * @method testFailed
 * @param {TestCase} test which just failed
 * @param {Array} remainingTests remaining tests
 * @param {Error} failure error object
 */
Portal.prototype.testFailed = function (test, remainingTests, failure) {
  this.failedTests.push(test);
  this.emit('failure', failure);
  this.runQueue(remainingTests);
};

/**
 * Load tests, recursively parsing directories
 * @param {array} testPaths array of paths to parse
 * @param {array} tests loaded tests
 * @return {array} array of loaded tests
 */
Portal.prototype.loadTests = function (testPaths, tests) {
  tests = tests || [];

  testPaths.forEach(function (testPath) {
    var Test, test, children;

    if (!fs.existsSync) {
      throw new Error('Unable to find file ' + testPath);
    }

    if (fs.statSync(testPath).isDirectory()) {
      children = fs.readdirSync(testPath).map(function (child) {
        return path.resolve(testPath, child);
      });

      tests.concat(this.loadTests(children, tests));
      return;
    }

    Test = require(path.resolve(process.cwd(), testPath));

    if (typeof Test !== 'function') {
      throw new Error('Unable to load ' + testPath);
    }

    cutil.mixin(TestCase, Test);
    test      = new Test();
    test.name = Test.testName;

    if (!test.name) {
      throw new Error('Test ' + testPath + ' must have a name.');
    }

    try {
      test.description = Test.description.slice(0, 40);
    } catch (e) {
      throw new Error('Test ' + testPath + ' must have a description.');
    }

    test.webdriver = webdriver;
    tests.push(test);
  }, this);

  return tests;
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

  this.server.stop().then(function () {
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
Portal.prototype.screenshot = function () {
  this.lastDriver.takeScreenshot().then(function (data) {
    fs.writeFileSync('ss1.png', data, 'base64');
  });
};

module.exports = Portal;
