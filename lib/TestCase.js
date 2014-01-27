var when = require('when');

/**
 * Base TestCase object
 */
function TestCase(driver) {
  this.when    = when;
  this._isDone = when.defer();
  this.isDone  = this._isDone.promise;
  this.driver  = driver;

}

/**
 * Run the testcase
 */
TestCase.prototype.run = function () {
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
 * @method page
 */
TestCase.prototype.page = function (key) {
  return this.env.host + '/' + this.pages[key];
};

/**
 * @method fail
 */
TestCase.prototype.fail = function (message) {
  throw new Error('Test Failure: ' + message);
};

module.exports = TestCase;
