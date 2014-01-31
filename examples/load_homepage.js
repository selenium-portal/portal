/**
 * Test loading the NYT homepage 
 */
module.exports             = function () {};
module.exports.testName    = 'Load Homepage';
module.exports.tags        = ['sample'];
module.exports.description = 'Load the New York Times homepage';

/**
 * Execute the test
 */
module.exports.prototype.execute = function () {
  var d = this.driver;

  d.get(this.url('home'));
  d.waitForTitleToBe(/.*The New York Times.*/);
};



