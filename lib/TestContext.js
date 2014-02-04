'use strict';

var when      = require('when'),
    webdriver = require('selenium-webdriver');

module.exports = TestContext;

/**
 * @class TestContext
 * @constructor
 * @param {Portal} application context
 */
function TestContext(portal) {
  var steps, driver;

  steps             = [];
  this.step         = this.step.bind(this);
  this.url          = this.url.bind(this);
  this.activeStep   = null;
  this.screenshotId = 0;

  Object.defineProperties(this, {
    /**
     * @property when
     */
    when: {
      get: function () {
        return when;
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
     * @property pages
     */
    pages: {
      get: function () {
        return portal.pages;
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
        return driver;
      },

      set: function (seleniumDriver) {
        driver      = seleniumDriver;
        driver.quit = driver.quit.bind(driver);
      }
    },

    /**
     * @property portalEvent
     */
    on: {
      get: function () {
        return function () {
          portal.on.apply(portal, arguments);
        };
      }
    },

    /**
     * @property emit
     */
    emit: {
      get: function () {
        return function () {
          portal.emit.apply(portal, arguments);
        }
      }
    },

    /**
     * @property screenshot
     */
    screenshot: {
      get: function () {
        return function () {
          this.driver.wait(function () {
            portal.screenshot(this.driver, this.screenshotFilename());
            return true;
          }.bind(this), 100, 'Take screenshot');
        }
      }
    }
  });
}

/**
 * @method step
 */
TestContext.prototype.step = function (description) {
  var step = {
    title  : description,
    passed : undefined,
    error  : null
  };

  this.steps.push(step);
  this.driver.wait(function () {
    this.emit('test:step', this, description);
    this.activeStep = step;
    step.passed     = true;
    return true;
  }.bind(this), 100, 'Set test step');
};

/**
 * @method url
 */
TestContext.prototype.url = function (key) {
  var path = ('/' + this.urls[key]).replace('//', '/');

  return this.env.host + path;
};

/**
 * @method screenshotFilename
 */
TestContext.prototype.screenshotFilename = function () {
  var filename = [this.activeStep.title, this.screenshotId, '.png'].join(' ');

  this.screenshotId = this.screenshotId + 1;

  return filename.replace(/ /g, '_');
};
