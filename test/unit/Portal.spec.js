var spec   = require('../helpers/spec'),
    expect = require('expect.js'),
    Portal = require('../../Portal');

describe('Portal App', function () {
  beforeEach(function () {
    portal = new Portal();
  });

  describe('loadTests', function () {
    var tests;

    beforeEach(function () {
      require = this.sinon.spy();

      portal.env = { host: 'http://localhost:4000' };
      portal.urls = {
        home: '/',
        login: '/login'
      };

      tests = portal.loadTests([this.fixturePath('selenium_tests')]);
    });

    it('should load correct tests', function () {
      expect(tests.length).to.be(2);
    });

    it('should generate the correct url', function () {
      var url = tests[0].url('login');

      expect(url).to.be('http://localhost:4000/login');
    });
  });
});

