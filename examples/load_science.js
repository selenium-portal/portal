/**
 * Test loading the NYT Science Section
 */
module.exports             = function () {};
module.exports.testName    = 'Load Science News';
module.exports.tags        = ['sample'];
module.exports.description = 'Load the New York Times Science Section';

/**
 * Execute the test
 */
module.exports.prototype.execute = function () {
  var d = this.driver;

  d.get(this.page('science'));
  d.waitForTitleToBe(/.*Science News*/);
};
