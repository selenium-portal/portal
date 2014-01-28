'use strict';

module.exports = ModuleLoader;

/**
 * Module Loader
 * @class ModuleLoader
 * @constructor
 * @param {Object} moduleConfig hash mapping module names to module paths
 */
function ModuleLoader(moduleConfig) {
  this.config = moduleConfig;
}

/**
 * Load modules
 */
ModuleLoader.prototype.load = function () {
  var config, modules;

  config  = this.config;
  modules = {};

  Object.keys(this.config).forEach(function (key) {
    var path, module;

    path = this.config[key];

    try {
      modules[key] = require(path);
    } catch (e) {
      throw new Error('Failed to load module ' + key + ' (' + path + ')');
    }
  }, this);

  this.modules = modules;
  return modules;
};
