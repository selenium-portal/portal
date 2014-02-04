var spec         = require('../../helpers/spec'),
    expect       = require('expect.js'),
    path         = require('path'),
    moduleLoader = spec.require('lib/ModuleLoader');

describe('moduleLoader', function () {
  describe('load modules', function () {
    var loader, config, modules;

    beforeEach(function () {
      config = {
        util: '../../fixtures/modules/util'
      };

      modules = moduleLoader.load(spec.mock('portal.mock'), __dirname, config);
    });

    it('should load one module', function () {
      expect(Object.keys(modules).length).to.be(1);
    });

    it('should capitialize string', function () {
      var str = modules.util.cap('hEllo THere');
      expect(str).to.be('HELLO THERE');
    });

  });
});

