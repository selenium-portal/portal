var webdriver = require('selenium-webdriver'),
    TestCase  = require('./lib/TestCase'),
    path      = require('path'),
    when      = require('when'),
    fs        = require('fs');

/**
 * Portal Application Object
 * @class Portal
 * @constructor
 * @param {array} argv command line arguments
 */
function Portal(argv) {
  this.argv = argv;
}

/**
 * Initialize Portal
 */
Portal.prototype.init = function () {
  try {
    this.config = require(path.resolve(process.cwd(), process.env.config));
    this.env = this.config.env[process.env.env];
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


  return this.startLocalServer().then(this.runTests.bind(this));
};

/**
 * Run all tests
 */
Portal.prototype.runTests = function () {
  this.testQueue = this.loadTests(this.argv.slice(2));
  this.runQueue(this.testQueue);
};

/**
 * Create selenium driver with current settings
 */
Portal.prototype.createDriver = function () {
  return new webdriver.Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
};

/**
 * Run queue of tests, serially
 * @param {array} queue tests
 */
Portal.prototype.runQueue = function (queue) {
  var test = queue[0];
  queue = queue.slice(1);

  if (test) {
    test.driver = this.createDriver();
    test.env = this.env;
    test.run().then(test.driver.quit.bind(test.driver)).then(this.runQueue.bind(this, queue));
  } else {
    this.killLocalServer();
  }
};

/**
 * Load tests, recursively parsing directories
 * @param {array} testPaths array of paths to parse
 * @param {array} tests loaded tests
 * @return {array} array of loaded tests
 */
Portal.prototype.loadTests = function (testPaths, tests) {
  var newTests;

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

    mixin(TestCase, Test);
    test = new Test();
    tests.push(test);
  }, this);

  return tests;
};

/**
 * Mixin one object to another
 * @param {function} from object to copy properties from
 * @param {function} to object to copy properties to
 */
function mixin(from, to) {
  Object.keys(from.prototype).forEach(function (key) {
    to.prototype[key] = from.prototype[key];
  });
}

/**
 * Run the application
 */
Portal.prototype.run = function () {
  this.init();
};

/**
 * Shutdown the local selenium server
 */
Portal.prototype.killLocalServer = function () {
  this.p.kill();
};

/**
 * Start the local selenium server
 */
Portal.prototype.startLocalServer = function () {
  var spawn = require('child_process').spawn,
      path  = require('path'),
      def   = require('when').defer();

  this.p = spawn('java', ['-jar', path.resolve(__dirname, 'bin', 'selenium', 'selenium-server-standalone-2.35.0.jar')]);
  setTimeout(def.resolve, 2000);
  return def.promise;
};

module.exports = Portal;
