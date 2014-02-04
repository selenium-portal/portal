'use strict';

var path          = require('path'),
    ModuleContext = require('./ModuleContext');

module.exports = {

  /**
   * @method load
   * @param {Portal} portal application context
   * @param {string} basePath base path
   * @param {Object} modulesConfig hash mapping module names to module paths
   */
  load: function (portal, basePath, modulesConfig) {
    var modules = {};

    modulesConfig = modulesConfig || {};
    Object.keys(modulesConfig).forEach(function (key) {
      modules[key] = this.loadModule(portal, basePath, modulesConfig[key]);
    }, this);

    return modules;
  },

  /**
   * @method loadModule
   * @param {Portal} portal app object
   * @param {string} basePath base path
   * @param {string} modulePath path to module implementation
   */
  loadModule: function (portal, basePath, modulePath) {
    var module, absModulePath;

    absModulePath = path.resolve(basePath, modulePath);

    try {
      module = require(absModulePath);
    } catch (e) {
      throw new Error('Failed to load module ' + key + ' (' + absModulePath + ')');
    }

    module.initialize(new ModuleContext(portal, module));
    return module;
  }
};
