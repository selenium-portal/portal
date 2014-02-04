var when        = require('when'),
    webdriver   = require('selenium-webdriver'),
    TestContext = require('./TestContext');

module.exports = Test;

/**
 * Base Test object
 * @class Test
 * @constructor
 * @param {Portal} portal application context
 * @param {Object} implementation test implementation
 */
function Test(portal, implementation) {
  var ctx = new TestContext(portal);

  Object.defineProperties(this, {
    /**
     * @property implementation
     */
    implementation: {
      get: function () {
        return implementation;
      }
    },

    /**
     * @property execute
     */
    execute: {
      get: function () {
        if (typeof implementation.execute !== 'function') {
          throw new Error('Test ' + this.title + ' is missing required `execute()` method');
        }

        return implementation.execute.bind(implementation, ctx);
      }
    },

    /**
     * @property
     */
    title: {
      get: function () {
        return implementation.title;
      }
    },

    /**
     * @property description
     */
    description: {
      get: function () {
        return implementation.description;
      }
    },

    /**
     * @property ctx
     */
    ctx: {
      get: function () {
        return ctx;
      }
    },

    /**
     * @property portal
     */
    portal: {
      get: function () {
        return portal;
      }
    },

    /**
     * @property driver
     */
    driver: {
      get: function () {
        return ctx.driver;
      }
    },

    /**
     * @property steps
     */
    steps: {
      get: function () {
        return ctx.steps;
      }
    }
  });

  this.validate();
}

/**
 * @method initialize
 */
Test.prototype.initialize = function () {
  this.ctx.driver = this.portal.createDriver();
  this.implementation.initialize(this.ctx);
};

/**
 * Run the testcase
 * @method run
 */
Test.prototype.run = function () {
  this.startTime = new Date();

  return this.before()
             .then(this.execute)
             .then(this.after.bind(this));
};

/**
 * Pre run hook
 */
Test.prototype.before = function () {
  if (typeof this.implementation.before === 'function') {
    return this.implementation.before();
  } else {
    return when.resolve();
  }
};


/**
 * Post run hook
 */
Test.prototype.after = function () {
  if (typeof this.implementation.after === 'function') {
    return this.implementation.after();
  } else {
    return when.resolve();
  }
};

/**
 * @method fail
 */
Test.prototype.fail = function (error) {
  var step = this.ctx.activeStep;

  if (step) {
    step.passed = false;
    step.error  = error;
  }
};

/**
 * @method validate
 */
Test.prototype.validate = function () {
  var requiredProperties = ['title', 'description'];

  requiredProperties.forEach(function (prop) {
    if (typeof this.implementation[prop] === 'undefined') {
      throw new Error('Test must define value for property [' + prop + ']');
    }
  }, this);
};

