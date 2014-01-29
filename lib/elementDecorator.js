module.exports = function (element) {

  /**
   * Throw exception if element does not have specified class
   * @method assertClass
   * @param {string} className css class
   */
  element.assertClass = function (className) {
    className = ' ' + className + ' ';

    this.getAttribute('class').then(function (classAttribute) {
      if (!((' ' + classAttribute + ' ').replace(/[\t\r\n\f]/g, ' ').indexOf(className) >= 0)) {
        throw Error('Element does not have class ' + className);
      }
    });

    return this;
  };

  return element;
};
