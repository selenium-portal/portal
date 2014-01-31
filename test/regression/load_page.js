/**
 * Test for Loading a page
 */
module.exports             = function () {};
module.exports.testName    = 'Load Page';
module.exports.tags        = ['healthcheck'];
module.exports.description = 'Load a web page, wait for title to match';

/**
 * Execute the test
 */
module.exports.prototype.execute = function () {
  var d, m, url;

  d   = this.driver;
  m   = this.modules;
  url = this.url.bind(this);

  d.get('http://www.google.com');
  d.waitForTitleToBe('Google');
};
