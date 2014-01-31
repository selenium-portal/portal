'use strict';

var path = require('path');

module.exports = ModuleLoader;

/**
 * Module Loader
 * @class ModuleLoader
 * @constructor
 * @param {string} configPath base path
 * @param {Object} moduleConfig hash mapping module names to module paths
 */
function ModuleLoader(configPath, moduleConfig) {
  this.configPath = configPath;
  this.config     = moduleConfig;
}

/**
 * Load modules
 */
ModuleLoader.prototype.load = function () {
  var config, modules;

  config  = this.config;
  modules = {};

  Object.keys(this.config).forEach(function (key) {
    var modulePath, module;

    modulePath = path.resolve(this.configPath, this.config[key]);

    try {
      modules[key] = require(modulePath);
    } catch (e) {
      throw new Error('Failed to load module ' + key + ' (' + modulePath + ')');
    }
  }, this);

  this.modules = modules;
  return modules;
};
