'use strict';

var path         = require('path'),
    PageContext  = require('./PageContext');

module.exports = {
  /**
   * @method load
   * @param {Portal} portal app object
   * @param {string} basePath base path
   * @param {Object} pagesConfig hash mapping page names to page paths
   */
  load: function (portal, basePath, pagesConfig) {
    var pages = {};

    Object.keys(pagesConfig).forEach(function (key) {
      pages[key] = this.loadPage(portal, basePath, pagesConfig[key]);
    }, this);

    return pages;
  },

  /**
   * @method loadPage
   * @param {Portal} portal app object
   * @param {string} basePath base path
   * @param {string} pagePath path to page implementation
   */
  loadPage: function (portal, basePath, pagePath) {
    var page, absPagePath;

    absPagePath = path.resolve(basePath, pagePath);

    try {
      page = require(absPagePath);
    } catch (e) {
      throw new Error('Failed to load page ' + key + ' (' + absPagePath + ')');
    }

    page.initialize(new PageContext(portal, page));
    return page;
  }
};
