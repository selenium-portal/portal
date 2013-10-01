var webdriver = require('selenium-webdriver');

function Test() {
}

Test.prototype.execute = function () {
  console.log('load shopping');
  return this.driver.get(this.env.urls.shopping);
};

module.exports = Test;



