## Installing Portal

Portal is installable as an [npm module](https://npmjs.org/package/selenium-portal):

```bash
npm install -g selenium-portal
```

This will place the `portal` command in your system path.

## Running Tests

Running a Portal test requires a few options to be set. This is the basic syntax:

```bash
config=config.json env=dev browser=chrome portal simple_test.js
```

`config.json` is the [configuration file](#config.json) which is required for setting environment information.

`env` specifies the environment, or server hostname, where the test should be run. The environment name corresponds to a key in the `env` object within `config.json`.

`browser` specifies the browser used to run tests. Valid values include `chrome` and `phantomjs`. The default value is `phantomjs`. If `chrome` is selected, you must have the [chrome driver](http://chromedriver.storage.googleapis.com/index.html) binary in your system path. We recommend version 2.9 or greater.

`test.js` is the test that you wish to run. You can also specify a directory of tests instead of an individual file.

Currently, Portal uses [PhantomJS](http://phantomjs.org/) to run tests. In the near future, options will be added to specify any browser supported by the selenium project (Internet Explorer, Chrome, Firefox, etc.).

For more information, please refer to the full [config.json documentation](#config.json) below.

## Writing Tests

A small example test is shown below:

```javascript
// simple_test.js
module.exports = {
	title: 'Load Homepage',
	description: 'Load the New York Times homepage',
	tags: ['sample'],
	
	initialize: function (ctx) {
		this.ctx = ctx;
	},
	
	execute: function () {
		var ctx = this.ctx;
		
		ctx.step('Load Homepage');
		ctx.driver.get('http://www.nytimes.com');
		ctx.driver.waitForTitleToBe('The New York Times');
	}
};
```

The test is a node.js module, and the module's `exports` property must be set to an object, with several required properties.

* `title {string}` - A descriptive name for the test. Can be any string.
* `description {string}` - A longer description of the functionality the test exercises.
* `tags {array}` - An array of (string) tags. This allows for selecting which tests to run in a given test run. For example, you might want to run all `'login'` tests. Note: selective test running based on tags is not yet implemented.
* `execute {function}` - This is the main function where the test's logic resides. Portal will call this method when the test is run.
* `initialize {function}` - Called once to initialize the test. This function is passed the {TestContext} object, which is described below.

### TestContext

The context passed to a test's `initialize` method serves as the API for interacting with the Portal framework.

| Property      | Purpose        | Sample Usage |
|---------------|----------------|--------------|
| `driver` | Object used to execute selenium commands. | 	`ctx.driver.get('http://www.google.com')` |
| `step` | Function used to mark a distinct step in a test. Descriptive step names are useful when parsing test results to identify where errors occur. | `this.step('Login to Admin Panel');` |
| `url` | Function which generates an environment specific URL. | `ctx.url('home')` |
| `modules` | Object containing references to any loaded code modules, specified in `config.json`. | `ctx.modules.util.doSomethingGood()`|
| `screenshot` | Take a screenshot of the browser's current state. | `ctx.screenshot()`|

## Driver API
The `driver` object provides the following methods for controlling the browser:

| Property      | Purpose        | Sample Usage |
|---------------|----------------|--------------|
| `get` | Function to load a URL. | `this.driver.get('http://www.google.com')`. Often used in conjunction with `url`: `this.driver.get(this.url('home'))`|
|`querySelector`| Function to locate an element on the currently loaded page. Throws an error if the element described by the selector cannot be found. | `this.driver.querySelector('body a.navbar > span');` |
| `waitForTitleToBe` | Function which waits for the page title to be a given string, or to match a given regular expression. Accepts an optional timeout of how long to wait (default is 5000ms). | `this.driver.waitForTitleToBe(/.*ABC News/, 10000);` |

## Element API

Once an element is selected (using a method such as `this.driver.querySelector()`), assertions can be made against that element.

| Property      | Purpose        | Sample Usage |
|---------------|----------------|--------------|
| `assertClass` | Function which asserts that the element has a given css classname. | `this.driver.querySelector('body').assertClass('ie-7');` This command would throw an error if the `<body>` element on the current page did not have the `ie-7` class applied.|
| `assertText` | Function which asserts that the element has a given inner text value. | `this.driver.querySelector('#foo').assertText('bye');` This command would throw an error if the inner text of the element with id="foo" was not the string 'bye'|

<a name="wiki-config.json"></a>q
## Project Configuration With `config.json`

This file contains configuration values which describe your testing environment, how results should be reported, and any supporting code modules which your tests rely upon. A sample configuration is shown below, followed by detailed descriptions of the available properties.

```json
{
  "env": {
    "dev": {
      "host": "http://localhost:2020"
    },
    "staging": {
      "host": "http://staging.myapp.com:3131"
    },
    "prod": {
      "host": "http://www.myapp.com"
    }
  },

  "urls": {
    "home": "/",
    "login": "/r/login",
    "signup": "/r/s/new_user_signup"
  },

  "reporters": [
    "./my_reporter/special_format.js"
  ],

  "modules": {
    "util": "./ns/util"
  },
  
  "pages": {
    "home": "./pages/HomePage"
   }
}
```

### `env`

This property specifies the available environments for running tests.

```json
"env": {
    "dev": {
      "host": "http://localhost:2020"
    },
    "staging": {
      "host": "http://staging.myapp.com:3131"
    },
    "prod": {
      "host": "http://www.myapp.com"
    }
  }
```

The environment is selected at run time by setting the `env` value:

```bash
config=config.json env=dev portal my_test.js
```

Here, the root hostname for test URLs would be `http://localhost:2020`.

### `urls`

This property assigns a friendly name to URL paths, and is used in conjunction with the selected `env` value to generate absolute URLs at runtime.

```json
"urls": {
    "home": "/",
    "login": "/r/login",
    "signup": "/r/s/new_user_signup"
  }
```

For example, if you ran portal with `env=dev`, the generated url from the test commad `this.url('login')` would be `http://localhost:2020/r/login`.

### `reporters`

Reporters are used to output test results. Multiple reporters may be used simultaneously. For example, you may want to see test results printed to the console and also saved to a file on disk. 

Portal emits a set of events which all reporters can listen to, and respond to however they wish. If this property is omitted from the configuration file, the default [console reporter](https://github.com/selenium-portal/portal/blob/master/lib/reporters/console.js) will be used.

```json
"reporters": [
    "./my_reporter/special_format.js"
 ]
 ```
 
| Event  | Parameters | Description  |
|---------------|----------------|----|
| `error:unknown` | `error` (the exception) | Emitted when an uncaught exception is thrown in the course of test execution. |
| `testrun:start` | | Emitted when Portal begins executing the set of tests. |
| `testrun:end` | | Emitted when Portal stops executing the set of tests. May occur when all tests are complete, or after a failed test. Portal will stop execution after a failed test. |
| `test:passed` | `test` (the test object) | Emitted after a test passes.|
| `test:failed` | `test` (the test object), `failure` (the exception) | Emitted after a test fails.|
| `test:start` | `test` (the test object) | Emitted before a test is executed. |
| `test:end` | `test` (the test object) | Emitted after a test ends, whether it passes or fails. |
| `screenshot:saved` | `filepath` (the absolute filesystem path of the screenshot) | Emitted after a screenshot is saved. |
### `modules`

Modules contain custom code which your tests rely on. These can be loaded by Portal and made available to your tests at runtime.

```json
"modules": {
  "util": "./ns/util"
 }
```


