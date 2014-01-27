var webdriver      = require('selenium-webdriver');

module.exports = function (driver) {

  /**
   * Find an element by CSS selector
   * @param {string} selector the css selector
   */
  driver.findElementByCss = function () {
    return driver.findElement(webdriver.By.css.apply(webdriver.By, arguments));
  };

  /**
   * Find an element by ID
   * @param {string} id the element's id
   */
  driver.findElementById = function () {
    return driver.findElement(webdriver.By.id.apply(webdriver.By, arguments));
  };

  /**
   * Wait for the page title to be something specific
   * @param {string|RegExp} expected the page title or pattern
   * @param {number} timeout how long to wait
   */
  driver.waitForTitleToBe = function (expected, timeout) {
    timeout = timeout || 5000;

    driver.wait(function () {
      return driver.getTitle().then(function (title) {
        if (expected instanceof RegExp) {
          return expected.test(title);
        } else {
          return title === expected;
        }
      });
    }, timeout, 'Waiting for title to be ' + expected);
  };

  return driver;

};
