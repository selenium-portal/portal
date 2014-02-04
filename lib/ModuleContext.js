'use strict';

var when      = require('when'),
    webdriver = require('selenium-webdriver');

module.exports = ModuleContext;

/**
 * @class ModuleContext
 * @constructor
 * @param {Portal} portal application context
 * @param {object} implementation module
 */
function ModuleContext(portal, implementation) {
  portal.on('test:start', this.onTestChange.bind(this));

  Object.defineProperties(this, {
    /**
     * @property selectors
     */
    selectors: {
      get: function () {
        return implementation.selectors || {};
      }
    },

    /**
     * @property steps
     */
    steps: {
      get: function () {
        return steps;
      }
    },

    /**
     * @property env
     */
    env: {
      get: function () {
        return portal.env;
      }
    },

    /**
     * @property urls
     */
    urls: {
      get: function () {
        return portal.urls;
      }
    },

    /**
     * @property modules
     */
    modules: {
      get: function () {
        return portal.modules;
      }
    },

    /**
     * @property driver
     */
    driver: {
      get: function () {
        return this.testCtx.driver;
      }
    }
  });
}

/**
 * @method onTestChange
 */
ModuleContext.prototype.onTestChange = function (test) {
  this.testCtx = test.ctx;
};

