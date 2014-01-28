var spec   = require('../helpers/spec'),
    expect = require('expect.js'),
    Portal = require('../../Portal');

describe('Portal App', function () {
  beforeEach(function () {
    portal = new Portal();
  });

  describe('loadTests', function () {

    beforeEach(function () {
      require = this.sinon.spy();
    });

    it('should load correct tests', function () {
      var tests = portal.loadTests([this.fixturePath('selenium_tests')]);
      expect(tests.length).to.be(2);
    });


  });
});

