/**
 * Test for Loading a page
 */
module.exports = {
  title: 'Load Page',
  description: 'A sample test showing how to load a page',
  tags: ['sample'],

  /**
   * Execute the test
   * @method execute
   */
  execute: function (ctx) {
    var d, m, url;

    d   = ctx.driver;
    m   = ctx.modules;
    url = ctx.url;

    ctx.step('Load google');
    d.get('http://www.google.com');

    d.getTitle().then(function (title) {
      console.log('page title is', title);
    });

    return d.waitForTitleToBe('Google');
  }
};
