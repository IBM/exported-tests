/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TestParser from './base';
import bindFunctions from '../utilities/bind-functions';

/**
 * BDD supported Exported Tests' `beforeAll` function.
 * @typedef {function} beforeAll
 * @param {function} done function to notify test runner the function is complete
 * @param {DocumentFragment} fragment fragment being tested
 * @param {Window} [wndw] full window object if needed for interactions
 */

/**
 * BDD supported Exported Tests' `beforeEach` function.
 * @typedef {function} beforeEach
 * @param {function} done function to notify test runner the function is complete
 * @param {DocumentFragment} fragment fragment being tested
 * @param {Window} [wndw] full window object if needed for interactions
 */

/**
 * BDD supported Exported Tests' `afterAll` function.
 * @typedef {function} afterAll
 * @param {function} done function to notify test runner the function is complete
 * @param {DocumentFragment} fragment fragment being tested
 * @param {Window} [wndw] full window object if needed for interactions
 */

/**
 * BDD supported Exported Tests' `afterEach` function.
 * @typedef {function} afterEach
 * @param {function} done function to notify test runner the function is complete
 * @param {DocumentFragment} fragment fragment being tested
 * @param {Window} [wndw] full window object if needed for interactions
 */

/**
 * Exported Tests parser for BDD formatted tests
 * Confirmed to work with Mocha and Jest.
 */
class BDDTestParser extends TestParser {
  /**
   * Overwrite TestParser bindFunctions to include BDD unique functions
   * @private
   */
  _bindFunctions() {
    super._bindFunctions();

    // Bind functions
    const publicFunctions = {
      suiteSetup: this.suiteSetup,
      suiteCleanup: this.suiteCleanup,
    };

    bindFunctions(publicFunctions, this);
  }

  /**
   * BDD Describe function setup. This function converts Exported Tests `beforeAll` and `beforeEach` functions
   * in to describe function's `before(All)` and `before` functions using the done function to denote the end
   * of execution for the setup.
   * @param {test-suite} test see typedef
   * @param {DocumentFragment} fragment fragment being tested
   * @private
   *
   * @example
   * // For sample input and output code see Examples 1 - 3:
   * // input: `./examples/exported-tests.js`
   * // expected output:`./examples/expected-BDD.js`
   */
  suiteSetup(test, fragment) {
    if (typeof test.before === 'function') {
      console.warning(
        'Exported Tests do not support `before` use the `beforeAll` property instead'
      );
    }
    const wndw = this.window;
    if (typeof test.beforeAll === 'function') {
      // Mocha uses the before function; Jest uses beforeAll
      const beforeFunc = typeof beforeAll === 'function' ? beforeAll : before;
      beforeFunc(done => {
        test.beforeAll(done, fragment, wndw);
      });
    }
    if (typeof test.beforeEach === 'function') {
      beforeEach(done => {
        test.beforeEach(done, fragment, wndw);
      });
    }
  }

  /**
   * BDD Describe function clean up. This function converts Exported Tests `afterAll` and `afterEach` functions
   * in to describe function's `after(All)` and `after` functions using the done function to denote the end
   * of execution for the setup.
   * @param {test-suite} test see typedef
   * @param {DocumentFragment} fragment fragment being tested
   * @private
   */
  suiteCleanup(test, fragment) {
    if (typeof test.after === 'function') {
      console.warning(
        'Exported Tests do not support `after` use the `afterAll` property instead'
      );
    }
    const wndw = this.window;
    if (typeof test.afterAll === 'function') {
      // Mocha uses the after function; Jest uses afterAll
      const afterFunc = typeof afterAll === 'function' ? afterAll : after;
      afterFunc(done => {
        test.afterAll(done, fragment, wndw);
      });
    }
    if (typeof test.afterEach === 'function') {
      afterEach(done => {
        test.afterEach(done, fragment, wndw);
      });
    }
  }

  /**
   * BDD implementation of `createSuite`. This function creates a `describe` function. This function is also called
   * by `createFragmentSuite` (via the `testFunction` parameter) so `suiteSetup/Cleanup` is only performed once even
   * when there are multiple `describe`s
   * @param {test-suite} suite see typedef
   * @param {DocumentFragment} [fragment]  fragment being tested
   * @param {integer} [index] current index when running a `set` of fragments
   * @param {boolean} [includeSetupCleanup=true] flag to determine if the  describe set should have setup and
   *          clean up functions applied since with fragment sets we have additional describe groupings
   * @private
   *
   * @example
   * // For sample input and output code see Example 7:
   * // input: `./examples/exported-tests.js`
   * // expected output:`./examples/expected-BDD.js`
   */
  createSuite(suite, fragment, index, includeSetupCleanup = true) {
    if (this.doParseTest(suite.checkConditions, fragment, index)) {
      if (includeSetupCleanup) {
        describe(suite.name, () => {
          this.suiteSetup(suite, fragment);
          this.parser(suite.tests, fragment, index);
          this.suiteCleanup(suite, fragment);
        });
      } else {
        this.parser(suite.tests, fragment, index);
      }
    }
  }

  /**
   * BDD implementation of `createFragmentSuite` that makes a `describe` function for each sub-fragment tested.
   * @param {test-set|exported-test} test see typedefs
   * @param {DocumentFragment} fragment document fragment being tested
   * @param {null} _ typically the index parameter that is not required for this function
   * @param {function} testFunction function that creates a test set or individual tests
   * @private
   *
   * @example
   * // For sample input and output code see Examples 8 - 9:
   * // input: `./examples/exported-tests.js`
   * // expected output:`./examples/expected-BDD.js`
   */
  createFragmentSuite(test, fragment, _, testFunction) {
    describe(test.name, () => {
      this.suiteSetup(test, fragment);
      test.getFragmentSet(fragment).forEach((frag, i) => {
        describe(`${test.fragmentSetMessage || 'Set index'}: ${i}`, () => {
          testFunction(test, frag, i, false);
        });
      });
      this.suiteCleanup(test, fragment);
    });
  }

  /**
   * BDD implementation of `createInheritedSuite` that makes a `describe` function around the imported tests.
   * @param {exported-test} test see typedef
   * @param {DocumentFragment} fragment document fragment being tested
   * @param {integer} [index] current index when running a `set` of fragments
   * @private
   *
   * @example
   * // For sample input and output code see Example 10:
   * // input: `./examples/exported-tests.js`
   * // expected output:`./examples/expected-BDD.js`
   */
  createInheritedSuite(test, fragment, index) {
    describe(test.name, () => {
      this.parser(test.inheritedTests, fragment, index);
    });
  }

  /**
   * BDD implementation of `createTest`. Converts a test to an `it` function.
   * @param {exported-test} exportedTest see typedef
   * @param {DocumentFragment} fragment document fragment being tested
   * @param {integer} [index] index when testing a fragment set
   */
  createTest(exportedTest, fragment, index) {
    if (
      typeof exportedTest.getActual !== 'function' ||
      typeof exportedTest.runComparison !== 'function' ||
      typeof exportedTest.name !== 'string'
    ) {
      throw new Error('Invalid Exported Tests test format');
    }
    const wndw = this.window;
    it(exportedTest.name, () =>
      exportedTest
        .getActual(fragment, wndw, index)
        .then(exportedTest.runComparison)
    );
  }
}

export default BDDTestParser;
