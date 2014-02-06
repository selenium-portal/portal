/**
 * Test loading the NYT Science Section
 */
module.exports = {
  /**
   * @property title
   */
  title: 'Load Science News',

  /**
   * @property tags
   */
  tags: ['sample'],

  /**
   * @property description
   */
  description: 'Load the New York Times science section',

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
    this.ctx.driver.get(this.ctx.url('science'));
    this.ctx.driver.waitForTitleToBe(/.*Science News*/);
  }
};

