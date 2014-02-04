var spec         = require('../../helpers/spec'),
    expect       = require('expect.js'),
    path         = require('path'),
    testLoader   = require('../../../lib/testLoader');

describe('TestLoader', function () {
  describe('load single test', function () {
    var tests;

    beforeEach(function () {
      var portalMock, testPath;

      portalMock = spec.mock('portal.mock');
      testPath   = spec.fixturePath('selenium_tests', 'login', 'a.js');
      tests      = testLoader.load(portalMock, '', testPath);
    });

    it('should load one test', function () {
      expect(tests.length).to.be(1);
    });

    it('should have one test with correct title', function () {
      expect(tests[0].title).to.be('Test A');
    });
  });

  describe('load directory of tests', function () {
    var tests;

    beforeEach(function () {
      var portalMock, testPath;

      portalMock = spec.mock('portal.mock');
      testPath   = spec.fixturePath('selenium_tests', 'login');
      tests      = testLoader.load(portalMock, '', testPath);
    });

    it('should load two tests', function () {
      expect(tests.length).to.be(2);
    });
  });

  describe('load directory of tests, which also contains non test files', function () {
    var tests;

    beforeEach(function () {
      var portalMock, testPath;

      portalMock = spec.mock('portal.mock');
      testPath   = spec.fixturePath('selenium_tests');
      tests      = testLoader.load(portalMock, '', testPath);
    });

    it('should load two tests', function () {
      expect(tests.length).to.be(2);
    });
  });
});

