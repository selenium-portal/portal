var when = require('when');

/**
 * Base TestCase object
 */
function TestCase(driver) {
  this.when    = when;
  this._isDone = when.defer();
  this.isDone  = this._isDone.promise;
  this.driver  = driver;

  // this.run = function () {
    // console.log('foo');
  // };
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
  var def;

  if (typeof this.before === 'function') {
    return this.before();
  } else {
    def = when.defer();
    def.resolve();
    return def.promise;
  }
};


/**
 * Post run hook
 */
TestCase.prototype.post = function () {
  var def;

  if (typeof this.after === 'function') {
    return this.after();
  } else {
    def = when.defer();
    def.resolve();
    return def.promise;
  }
};

module.exports = TestCase;
