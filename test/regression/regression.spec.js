// var spec         = require('../../helpers/spec'),
var expect       = require('expect.js'),
    path         = require('path'),
    spawn        = require('child_process').spawn;

describe('Regression tests', function () {
  var nodePath, portalPath, exec, cmd, configPath, testPath, passingTests, options;

  before(function () {
    nodePath     = '/usr/local/bin/node';
    portalPath   = path.resolve(__dirname, '..', '..', 'bin', 'portal');
    configPath   = path.resolve(__dirname, 'config.json');
    passingTests = path.resolve(__dirname, 'tests', 'should_pass', 'load_page.js');
    options      = {
      env: {
        config: configPath, 
        env: 'development',
        uid: process.getuid()
      }
    };
  });

  it('should all pass, returning exit code (0)', function (done) {

    this.timeout(200000);
    console.log('config='+options.env.config, 'env='+options.env.env, nodePath, portalPath, passingTests);
    exec = spawn(nodePath, [portalPath, passingTests], options);

    exec.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    exec.stderr.on('data', function (data) {
      console.log(data.toString());
    });

    exec.on('close', function (code) {
      expect(code).to.be(0);
      done();
    });

  });

});
