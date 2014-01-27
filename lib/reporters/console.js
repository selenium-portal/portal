function ConsoleReporter(portal) {
  portal.on('failure', this.onFailure.bind(this));
  portal.on('testrun:start', this.onTestrunStart.bind(this));
  portal.on('testrun:end', this.onTestrunEnd.bind(this));
  portal.on('testcase:passed', this.onPassed.bind(this));
  portal.on('testcase:start', this.onTestCaseStart.bind(this));
}

/**
 * Handle portal error event
 * @param {object} failure information about the failure
 */
ConsoleReporter.prototype.onFailure = function (failure) {
  console.log('Failure: ', failure);
  failure.stack && console.log(failure.stack);
};

ConsoleReporter.prototype.onPassed = function (test) {
  console.log('Test Passed!', test.name);
};

ConsoleReporter.prototype.onTestrunStart = function () {
  console.log('Start test run');
};

ConsoleReporter.prototype.onTestrunEnd = function () {
  console.log('End test run');
};

ConsoleReporter.prototype.onTestCaseStart = function (name, description) {
  console.log('Starting test', name, '--', description);
};

module.exports = ConsoleReporter;
