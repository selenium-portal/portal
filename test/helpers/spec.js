var sinon = require('sinon'),
    path  = require('path');

beforeEach(function () {
  this.sinon       = sinon.sandbox.create();
  this.fixturePath = fixturePath;
});

afterEach(function () {
  this.sinon.restore();
});

function fixturePath(p) {
  return path.resolve(__dirname, '..', 'fixtures', p);
}

