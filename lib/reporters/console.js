module.exports = ConsoleReporter;

/**
 * @class ConsoleReporter
 */
function ConsoleReporter(portal) {
  this.portal = portal;
  portal.on('error:unknown', this['error:unknown'].bind(this));
  portal.on('testrun:start', this['testrun:start'].bind(this));
  portal.on('testrun:end', this['testrun:end'].bind(this));
  portal.on('test:passed', this['test:passed'].bind(this));
  portal.on('test:failed', this['test:failed'].bind(this));
  portal.on('test:start', this['test:start'].bind(this));
  portal.on('test:step', this['test:step'].bind(this));
  portal.on('test:end', this['test:end'].bind(this));
  portal.on('screenshot:saved', this['screenshot:saved'].bind(this));
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
 * @method test:passed
 * @param {Test} test which passed
 */
ConsoleReporter.prototype['test:passed'] = function (test) {
  console.log('Test Passed!', test.title);
};

/**
 * Handle portal test failed event
 * @method test:failed
 * @param {Test} test which failed
 * @param {object} failure information about the failure
 */
ConsoleReporter.prototype['test:failed'] = function (test, failure) {
  console.log('test failure', test.title, test.description);
  console.log(test.title, 'failed at step "' + test.activeStep.title + '"');
  failure.stack && console.log(failure.stack);
};

/**
 * @method testrun:start
 */
ConsoleReporter.prototype['testrun:start'] = function () {
  console.log('START TEST RUN');
};

/**
 * @method testrun:end
 */
ConsoleReporter.prototype['testrun:end'] = function () {
  console.log('END TEST RUN');
};

/**
 * @method test:start
 * @param {Test} test which is starting
 */
ConsoleReporter.prototype['test:start'] = function (test) {
  console.log('==========================================');
  console.log('Test Start:', test.title);
};

/**
 * @method test:step
 * @param {Test} test
 * @param {string} description
 */
ConsoleReporter.prototype['test:step'] = function (test, description) {
  console.log('>', description);
};

/**
 * @method test:end
 * @param {Test} test which is ending
 */
ConsoleReporter.prototype['test:end'] = function (test) {
  var runtime = (new Date() - test.startTime) / 1000;
  console.log('Test End:', test.title, '(' + runtime + ' seconds)');

  // test.steps.forEach(function (step) {
    // var status;

    // if (typeof step.passed === 'undefined') {
      // status = 'not executed';
    // } else if (step.passed) {
      // status = 'passed!';
    // } else {
      // status = 'failed';
    // }

    // console.log('   ', step.title, '[' + status + ']');
  // });
};

/**
 * @method screenshot:saved
 * @param {string} path of saved file
 */
ConsoleReporter.prototype['screenshot:saved'] = function (path) {
  console.log('> (screenshot)', path);
};
