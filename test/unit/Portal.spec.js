require('../helpers/spec');
var Portal = require('../../Portal');

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
      tests.length.should.equal(2);
    });


  });
});

