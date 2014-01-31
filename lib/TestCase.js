var when = require('when'),
    webdriver = require('selenium-webdriver');

/**
 * Base TestCase object
 */
function TestCase(portal) {
  this.when        = when;
  this._isDone     = when.defer();
  this.isDone      = this._isDone.promise;
  this.steps       = [];
  this.env         = portal.env;
  this.urls        = portal.urls;
  this.modules     = portal.modules;
  this.driver.quit = this.driver.quit.bind(this.driver);

  this.step = this.step.bind(this);
}

/**
 * Run the testcase
 */
TestCase.prototype.run = function () {
  this.startTime = new Date();

  return this.pre()
    .then(this.execute.bind(this))
    .then(this.post.bind(this));
};

/**
 * Pre run hook
 */
TestCase.prototype.pre = function () {
  if (typeof this.before === 'function') {
    return this.before();
  } else {
    return when.resolve();
  }
};


/**
 * Post run hook
 */
TestCase.prototype.post = function () {
  if (typeof this.after === 'function') {
    return this.after();
  } else {
    return when.resolve();
  }
};

/**
 * @method url
 */
TestCase.prototype.url = function (key) {
  var path = ('/' + this.urls[key]).replace('//', '/');

  return this.env.host + path;
};

/**
 * @method fail
 */
TestCase.prototype.fail = function (error) {
  var step = this.activeStep;

  if (step) {
    step.passed = false;
    step.error  = error;
  }
};

/**
 * @method step
 */
TestCase.prototype.step = function (description) {
  var step = {
    title  : description,
    passed : undefined,
    error  : null
  };

  this.steps.push(step);

  this.driver.wait(function () {
    this.activeStep = step;
    step.passed = true;
    return true;
  }.bind(this), 100, 'Set test step');
};

module.exports = TestCase;
