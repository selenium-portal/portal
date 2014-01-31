function ConsoleReporter(portal) {
  this.portal = portal;
  portal.on('error:unknown', this['error:unknown'].bind(this));
  portal.on('testrun:start', this['testrun:start'].bind(this));
  portal.on('testrun:end', this['testrun:end'].bind(this));
  portal.on('testcase:passed', this['testcase:passed'].bind(this));
  portal.on('testcase:failed', this['testcase:failed'].bind(this));
  portal.on('testcase:start', this['testcase:start'].bind(this));
  portal.on('testcase:end', this['testcase:end'].bind(this));
}

/**
 * Handle portal error event
 * @method error:unknown
 * @param {Error} error exception object
 */
ConsoleReporter.prototype['error:unknown'] = function (error) {
  // this.portal.screenshot();
  // console.log('Error:Unknown:', failure);
  // error.stack && console.log(error.stack);
};

/**
 * @method testcase:passed
 * @param {TestCase} test which passed
 */
ConsoleReporter.prototype['testcase:passed'] = function (test) {
  console.log('Test Passed!', test.title);
};

/**
 * Handle portal test failed event
 * @method testcase:failed
 * @param {TestCase} test which failed
 * @param {object} failure information about the failure
 */
ConsoleReporter.prototype['testcase:failed'] = function (test, failure) {
  console.log(test.title, 'failed at step "' + test.activeStep.title + '"');
  failure.stack && console.log(failure.stack);
};

/**
 * @method testrun:start
 */
ConsoleReporter.prototype['testrun:start'] = function () {
  console.log('Start test run');
};

/**
 * @method testrun:end
 */
ConsoleReporter.prototype['testrun:end'] = function () {
  console.log('End test run');
};

/**
 * @method testcase:start
 * @param {TestCase} test which is starting
 */
ConsoleReporter.prototype['testcase:start'] = function (test) {
  console.log('==========================================');
  console.log('TestCase Start:', test.title);
};

/**
 * @method testcase:end
 * @param {TestCase} test which is ending
 */
ConsoleReporter.prototype['testcase:end'] = function (test) {
  var runtime = (new Date() - test.startTime) / 1000;
  console.log('TestCase End:', test.title, '(' + runtime + ' seconds)');

  test.steps.forEach(function (step) {
    var status;

    if (typeof step.passed === 'undefined') {
      status = 'not executed';
    } else if (step.passed) {
      status = 'passed!';
    } else {
      status = 'failed';
    }

    console.log('   ', step.title, '[' + status + ']');
  });
};

module.exports = ConsoleReporter;
