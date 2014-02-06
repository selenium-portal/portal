/**
 * Test loading the NYT homepage 
 */
module.exports = {
  /**
   * @property title
   */
  title: 'Load Homepage',

  /**
   * @property tags
   */
  tags: ['sample'],

  /**
   * @property description
   */
  description: 'Load the New York Times homepage',

  /**
   * @method initialize
   * @param {TestContext} ctx
   */
  initialize: function (ctx) {
    this.ctx = ctx;
  },

  /**
   * @method execute
   */
  execute: function () {
    this.ctx.driver.get(this.ctx.url('home'));
    this.ctx.driver.waitForTitleToBe(/.*The New York Times.*/);
  }
};



