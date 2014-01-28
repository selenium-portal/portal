var spec         = require('../../helpers/spec'),
    expect       = require('expect.js'),
    path         = require('path'),
    ModuleLoader = require('../../../lib/ModuleLoader');

describe('ModuleLoader', function () {
  describe('load modules', function () {
    var loader, config;

    beforeEach(function () {
      config = {
        util    : path.resolve(__dirname, '../../fixtures/modules/util')
      };

      loader = new ModuleLoader(config);
      loader.load();
    });

    it('should load one module', function () {
      var modules = loader.modules;
      expect(Object.keys(modules).length).to.be(1);
    });

    it('should capitialize string', function () {
      var str = loader.modules.util.cap('hEllo THere');
      expect(str).to.be('HELLO THERE');
    });

  });
});

