var webdriver = require('selenium-webdriver');

function Test() {
}

Test.prototype.execute = function () {
  console.log('load news');
  return this.driver.get(this.env.urls.news);
};

module.exports = Test;



