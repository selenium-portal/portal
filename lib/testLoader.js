'use strict';

var path   = require('path'),
    fs     = require('fs'),
    extend = require('xtend'),
    Test   = require('./Test'),
    util   = require('./util');

module.exports = {

  /**
   * @method load
   * @param {Portal} portal app context
   * @param {string} basePath base path
   * @param {array} testPaths
   * @param {array} tests loaded thus far (used recursively)
   * @return {array} of loaded test objects
   */
  load: function (portal, basePath, testPaths, tests) {
    tests = tests || [];

    if (!Array.isArray(testPaths)) {
      testPaths = [testPaths];
    }

    testPaths.forEach(function (testPath) {
      var absTestPath, implementation, test, children;

      if (!fs.existsSync(testPath)) {
        throw new Error('Unable to find file ' + testPath);
      }

      if (fs.statSync(testPath).isDirectory()) {
        children = fs.readdirSync(testPath).map(function (child) {
          return path.resolve(testPath, child);
        });

        tests.concat(this.load(portal, basePath, children, tests));
        return;
      }

      // Skip if filename does not end in .js extension
      if (!/\.js$/.test(testPath)) {
        return;
      }

      absTestPath = path.resolve(basePath, testPath);

      try {
        implementation = require(absTestPath);
      } catch (e) {
        throw new Error('Failed to load test ' + absTestPath);
      }

      test = new Test(portal, implementation);
      tests.push(test);
    }, this);

    return tests;
  }
};
