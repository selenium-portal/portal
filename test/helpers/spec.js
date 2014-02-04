var sinon = require('sinon'),
    path  = require('path');

beforeEach(function () {
  this.sinon       = sinon.sandbox.create();
});

afterEach(function () {
  this.sinon.restore();
});

module.exports = {
  /**
   * @method mock
   */
  mock: function (path) {
    return require(this.mockPath(path));
  },

  /**
   * @method mockPath
   */
  mockPath: function () {
    return this.resolvePath('mocks', arguments);
  },

  /**
   * @method fixturePath
   */
  fixturePath: function () {
    return this.resolvePath('fixtures', arguments);
  },

  /**
   * @method resolvePath
   */
  resolvePath: function (type, args) {
    var mergedArgs = [__dirname, '..', type]
          .concat(Array.prototype.slice.call(args, 0));

    return path.resolve.apply(path, mergedArgs);
  },

  /**
   * @method require
   */
  require: function (requirePath) {
    return require(path.resolve(__dirname, '..', '..', requirePath));
  }
};

