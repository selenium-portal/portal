module.exports = Page;

/**
 * @class Page
 */
function Page (portal, implementation) {
  this.portal = portal;

  portal.on('testcase:start', this.onTestChange, this);

  Object.defineProperties(implementation, {
    /**
     * @method select
     */
    get: function () {
      return this.select.bind(this.implementation);
    }.bind(this)
  });

  Object.defineProperties(this, {
    /**
     * @property implementation
     */
    implementation: function () {
      get: function () {
        return implementation;
      }
    },

    selectors: {
      get: function () {
        return implementation.selectors || {};
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
    }
  });
}
