'use strict';

var when      = require('when'),
    webdriver = require('selenium-webdriver');

module.exports = PageContext;

/**
 * @class PageContext
 * @constructor
 * @param {Portal} portal application context
 * @param {object} implementation page
 */
function PageContext(portal, implementation) {
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
     * @property url
     */
    url: {
      get: function () {
        return this.testCtx.url;
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
PageContext.prototype.onTestChange = function (test) {
  this.testCtx = test.ctx;
};

/**
 * @method select
 * @param {string} selectorKey
 */
PageContext.prototype.select = function (selectorKey) {
  var selector = this.selectors[selectorKey];

  if (!selector) {
    selector = selectorKey;
  }

  return this.driver.querySelector(selector);
};
