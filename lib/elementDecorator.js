var base   = require('../node_modules/selenium-webdriver/_base'),
    assert = base.require('webdriver.testing.assert');

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
        throw Error('Element does not have class ' + className + '. element.className = ' + classAttribute);
      }
    });

    return this;
  };

  /**
   * Throw exception if element does contain specified inner text
   * @method assertText
   * @param {string} text inner text value
   */
  element.assertText = function (text) {
    this.getText().then(function (elText) {
      if (elText !== text) {
        throw Error('Element does not have text ' + text + '. element.innerText = ' + elText);
      }
    });

    return this;
  };
  return element;
};
