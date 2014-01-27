/**
 * Mixin one object to another
 * @param {function} from object to copy properties from
 * @param {function} to object to copy properties to
 */
module.exports.mixin = function (from, to) {
  Object.keys(from.prototype).forEach(function (key) {
    to.prototype[key] = from.prototype[key];
  });
};
