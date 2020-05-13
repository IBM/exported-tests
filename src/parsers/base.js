/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import bindFunctions from '../utilities/bind-functions';

/**
 * Base Exported Tests parser that is testing framework agnostic
 * @class
 */
class TestParser {
  /**
   * Determines if a test is a test-suite or exported-test
   * @param {test-suite|exported-test} test object that is either an instance of a test suite or an individual test
   * @returns {boolean} returns true for test-suite and false for exported-test; invalid structures will throw an error
   */
  static isSuite(test) {
    if (test.tests) {
      if (!Array.isArray(test.tests)) {
        throw new Error('Test suites must include an array of tests');
      }

      // It's a test-suite object
      return true;
    }
    if (typeof test.name === 'string') {
      // It's an exported-test
      return false;
    }
    throw new Error(
      'Invalid exported-test or test-suite object format (missing an name)'
    );
  }

  /**
   * Determines the type (set, inherited, or standard) of the test object
   * @param {test-suite|exported-test} test see typedefs
   * @returns {string} string representing the type of test (available return values: `set`, `inherit`, or `default`)
   */
  static getTestType(test) {
    if (typeof test.getFragmentSet === 'function') {
      // Test needs to run on multiple fragments
      return 'set';
    }
    if (Array.isArray(test.inheritedTests)) {
      // Test is an inherited set of tests
      return 'inherit';
    }
    return 'default';
  }

  /**
   * Tests for and uses a Test Developer defined function for getting a sub-fragment (`getSubFragment`)
   * returns the default DOM object
   * @param {exported-test} test see typedef
   * @param {DocumentFragment} fragment full document fragment
   * @returns {DocumentFragment} sub-fragment from Test Developer defined function or the default document
   */
  static getFragment(test, fragment) {
    if (test && typeof test.getSubFragment === 'function') {
      return test.getSubFragment(fragment);
    }

    return fragment;
  }

  /**
   * Initial setup for Test Parser
   * @param {test-set[]} tests group of test suites to be executed on a particular application or page
   * @param {Window|DocumentFragment|HTMLElement} wndwFragment JavaScript window object or Document Fragment object
   */
  constructor(tests, wndwFragment) {
    // if wndwFragment is a Window, get fragment from wndwFragment
    if (wndwFragment.window === wndwFragment && wndwFragment.document) {
      this.window = wndwFragment;
      this.fragment = wndwFragment.document;
    }
    // wndwFragment is a DocumentFragment
    else if (wndwFragment.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      this.fragment = wndwFragment;
    }
    // wndwFragment is an HTMLElement, convert to DocumentFragment
    else if (wndwFragment.nodeType === Node.ELEMENT_NODE) {
      const template = document.createElement('template');
      template.innerHTML = wndwFragment.outerHTML;
      this.fragment = template.content;
    } else {
      throw new Error(
        'Exported Tests require a Window object, DocumentFragment, or HTML element'
      );
    }

    this._bindFunctions();
    this.parser(tests, this.fragment);
  }

  /**
   * Bind public functions so that the reference to `this` is always accurate
   * @private
   */
  _bindFunctions() {
    // Bind functions
    const publicFunctions = {
      createSuite: this.createSuite,
      createInheritedSuite: this.createInheritedSuite,
      createFragmentSuite: this.createFragmentSuite,
      createTest: this.createTest,
      getTest: this.getTest,
      doParseTest: this.doParseTest,
      parser: this.parser,
    };

    bindFunctions(publicFunctions, this);
  }

  /**
   * Determines if the test gets parsed
   * @param {checkConditions} [conditions] see typedef
   * @param {DocumentFragment} [fragment] document fragment being tested
   * @param {integer} [index] current index when running a `set` of fragments
   *
   * @example
   * // For sample input and output code see Examples 4 - 6:
   * // input: `/examples/exported-tests.js`
   * // expected BDD output:`/examples/expected-BDD.js`
   */
  doParseTest(conditions, fragment, index) {
    return (
      typeof conditions === 'undefined' ||
      conditions(fragment, this.window, index)
    );
  }

  /**
   * Uses a testing framework specific test creator if it meets conditions to parse it
   * @param {exported-test} exportedTest see typedef
   * @param {DocumentFragment} [fragment] document fragment being tested
   * @param {integer} [index] current index when running a `set` of fragments
   */
  getTest(exportedTest, fragment, index) {
    if (this.doParseTest(exportedTest.checkConditions, fragment, index)) {
      this.createTest(exportedTest, fragment, index);
    }
  }

  /**
   * Parses a test suite in to a given testing framework. For more details/examples see `parsers/BDD.js`
   */
  createSuite() {
    console.warn(
      'Exported Tests: createSuite is a framework specific function that needs to be defined'
    );
  }

  /**
   * Parses multiple test suites to iterate over multiple document fragments. Testing framework specific
   * implementation required. For more details/examples see `parsers/BDD.js`
   */
  createFragmentSuite() {
    console.warn(
      'Exported Tests: createFragmentSuite is a framework specific function that needs to be defined'
    );
  }

  /**
   * Parses a test suite(s) from imported tests of a given component. Testing framework specific
   * implementation required. For more details/examples see `parsers/BDD.js`
   */
  createInheritedSuite() {
    console.warn(
      'Exported Tests: createInheritedSuite is a framework specific function that needs to be defined'
    );
  }

  /**
   * Converts an individual test in to a testing framework specific test. Testing framework specific
   * implementation required. For more details/examples see `parsers/BDD.js`
   */
  createTest() {
    console.warn(
      'Exported Tests: createTest is a framework specific function that needs to be defined'
    );
  }

  /**
   * Iterates over test suites to parse them in to a specific testing framework.
   * @param {test-suite[]} tests array of test-suites to be executed on a particular application or page
   * @param {DocumentFragment} fragment document fragment being tested
   * @param {integer} [index] current index when running a `set` of fragments
   */
  parser(tests, fragment, index) {
    // Is possible and okay to have an empty array. In this case the test parser just doesn't do anything
    if (!Array.isArray(tests)) {
      throw new Error('Test parser requires an array of test-suite objects');
    }

    tests.forEach(test => {
      if (this.constructor.isSuite(test)) {
        const testSuiteType = {
          set: this.createFragmentSuite,
          default: this.createSuite,
        }[this.constructor.getTestType(test)];

        testSuiteType(test, fragment, index, this.createSuite);
      } else {
        // test is an exported-test
        const testType = {
          set: this.createFragmentSuite,
          inherit: this.createInheritedSuite,
          default: this.getTest,
        }[this.constructor.getTestType(test)];

        testType(
          test,
          this.constructor.getFragment(test, fragment),
          index,
          this.getTest
        );
      }
    });
  }
}

export default TestParser;
