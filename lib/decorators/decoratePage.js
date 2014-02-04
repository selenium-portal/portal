module.exports = function (portal, page) {

  portal.on('testcase:start', function (test) {
    page.ctx = test.ctx;
  });

  /**
   * @method select
   * @param {string} selectorKey
   */
   page.select = function (selectorKey) {
    var selectors, selector;

    selectors = this.selectors;
    selector  = selectors[selectorKey];

    if (!selector) {
      throw Error('Selector "' + selectorKey + '" is not defined in page object.');
    }

    return this.ctx.driver.querySelector(selector);
  };

  // Add properties
  Object.defineProperties(page, {

    selectors: {
      get: function () {
        return this.selectors || {};
      }
    },

    driver: {
      get: function () {
        return this.ctx.driver;
      }
    },

    modules: {
      get: function () {
        return portal.modules;
      }
    },

    pages: {
      get: function () {
        return portal.pages;
      }
    }
  });

  return page;
}
