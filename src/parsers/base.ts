/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DOMWindow } from "jsdom";
import bindFunctions from '../utilities/bind-functions';

/**
 * Exported Tests individual test structure
 * @typicalname Individual test object structure
 * @typedef {object} exported-test
 * @property {string} name Test name (e.g. In Gherkin this would be the `Scenario`, where in BDD this is the `it` function)
 * @property {function} [checkConditions] See typedef (e.g. In Gherkin this could be statements defined by the `Given` step)
 *              (Note: ran prior to any test execution)
 * @property {test-suite[]} [inheritedTests] Set of tests or test suites that are imported from another component
 * @property {function} [getFragmentSet] See typedef (Note: ran prior to any test execution)
 * @property {function} [getSubFragment] See typedef (Note: ran prior to any test execution)
 * @property {function} getActual See typedef
 * @property {function} runComparison See typedef
 */
export interface ExportedTest {
  readonly name: string,
  readonly checkConditions?: Function,
  readonly inheritedTests?: TestSuite[],
  readonly getFragmentSet?: Function,
  readonly getSubFragment?: Function,
  readonly getActual?: Function,
  readonly runComparison?: Function,
}

/**
 * Exported tests that are grouped together in a single suite based on relationship to a single feature/functionality
 * @typicalname Test suite object structure
 * @typedef {object} test-suite
 * @property {string} name Name for the grouping of tests (e.g. In Gherkin this would be the `Feature`,
 *              where in BDD this is the `describe` function)
 * @property {exported-test[]} tests array of exported sets that are associated to the common feature/functionality
 * @property {function} [checkConditions] See typedef (e.g. In Gherkin this could be statements defined by a `Background` block)
 *              (Note: ran prior to any test execution)
 * @property {function} [beforeAll] See typedef (e.g. In Gherkin this could be statements defined by a `Background` block
 *              and is the  equivalent to the BDD framework's `before` (Mocha) or `beforeAll` (Jest) function used
 *              by the `describe` function)
 * @property {function} [beforeEach] See typedef (e.g. In Gherkin this could be statements defined by a `Background` block
 *              and is the equivalent to the BDD framework's `beforeEach` function used by the `describe` function)
 * @property {function} [afterAll] See typedef (e.g. Equivalent to the BDD framework's `after` (Mocha) or
 *              `afterAll` (Jest) function used by the `describe` function)
 * @property {function} [afterEach] See typedef (e.g. Equivalent to the BDD framework's `afterEach` function used by
 *              the `describe` function)
 * @property {function} [getFragmentSet] See typedef (Note: ran prior to any test execution)
 * @property {string} [fragmentSetMessage] String used as a suite description when creating tests for a fragment set.
 *    Default is `Set index: ${SET_INDEX}`
 */
export interface TestSuite {
  readonly name: string,
  readonly tests: ExportedTest[],
  readonly checkConditions?: Function,
  readonly beforeAll?: Function,
  readonly beforeEach?: Function,
  readonly afterAll?: Function,
  readonly afterEach?: Function,
  readonly getFragmentSet?: Function,
  readonly fragmentSetMessage?: string
}

/**
 * Defines the static methods of the TestParser Class
 */
export interface TestParserConstructor {
  new (tests: TestSuite, wndwFragment: Window|DocumentFragment|HTMLElement|DOMWindow): TestParserInterface,
  isSuite: Function,
  getTestType: Function,
  getFragment: Function,
}

/**
 * Defines the instance properties and methods of the TestParser class
 */
export interface TestParserInterface {
  window: Window|DOMWindow,
  fragment: DocumentFragment,
  doParseTest: Function,
  getTest: Function,
  createSuite: Function,
  createFragmentSuite: Function,
  createInheritedSuite: Function,
  createTest: Function,
  parser: Function,
}

/**
 * Base Exported Tests parser that is testing framework agnostic
 * @class
 */
class TestParser implements TestParserInterface {
  window = null;
  fragment = null;

  /**
   * Determines if a test is a test-suite or exported-test
   * @param {test-suite|exported-test} test object that is either an instance of a test suite or an individual test
   * @returns {boolean} returns true for test-suite and false for exported-test; invalid structures will throw an error
   */
  static isSuite(test: TestSuite|ExportedTest): boolean | never {
    if ((test as TestSuite).tests) {
      if (!Array.isArray((test as TestSuite).tests)) {
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
  static getTestType(test: TestSuite|ExportedTest): string {
    if (typeof test.getFragmentSet === 'function') {
      // Test needs to run on multiple fragments
      return 'set';
    }
    if (Array.isArray((test as ExportedTest).inheritedTests)) {
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
  static getFragment(test: ExportedTest, fragment: DocumentFragment): DocumentFragment {
    if (test && typeof test.getSubFragment === 'function') {
      return test.getSubFragment(fragment);
    }

    return fragment;
  }

  /**
   * Initial setup for Test Parser
   * @param {test-suite} tests group of test suites to be executed on a particular application or page
   * @param {Window|DocumentFragment|HTMLElement} wndwFragment JavaScript window object or Document Fragment object
   */
  constructor(tests: TestSuite[], wndwFragment: Window|DocumentFragment|HTMLElement|DOMWindow) {
    // if wndwFragment is a Window, get fragment from wndwFragment
    if ((wndwFragment as Window).window === wndwFragment && wndwFragment.document) {
      this.window = wndwFragment;
      this.fragment = wndwFragment.document;
    }
    // wndwFragment is a DocumentFragment
    else if ((wndwFragment as DocumentFragment).nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      this.fragment = wndwFragment;
    }
    // wndwFragment is an HTMLElement, convert to DocumentFragment
    else if ((wndwFragment as HTMLElement).nodeType === Node.ELEMENT_NODE) {
      const template = document.createElement('template');
      template.innerHTML = (wndwFragment as HTMLElement).outerHTML;
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
  doParseTest(conditions?: Function, fragment?: DocumentFragment, index?: number): boolean {
    return (
      typeof conditions === 'undefined' ||
      conditions(fragment, this.window, index)
    );
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
   * Uses a testing framework specific test creator if it meets conditions to parse it
   * @param {exported-test} exportedTest see typedef
   * @param {DocumentFragment} [fragment] document fragment being tested
   * @param {integer} [index] current index when running a `set` of fragments
   */
  getTest(exportedTest: ExportedTest, fragment?: DocumentFragment, index?: number): void {
    if (this.doParseTest(exportedTest.checkConditions, fragment, index)) {
      this.createTest(exportedTest, fragment, index);
    }
  }

  /**
   * Parses a test suite in to a given testing framework. For more details/examples see `parsers/BDD.js`
   */
  createSuite(s: TestSuite, f: DocumentFragment, i: number): void {
    console.warn(
      'Exported Tests: createSuite is a framework specific function that needs to be defined'
    );
  }

  /**
   * Parses multiple test suites to iterate over multiple document fragments. Testing framework specific
   * implementation required. For more details/examples see `parsers/BDD.js`
   */
  createFragmentSuite(s: TestSuite, f: DocumentFragment, i: number, testFunction?: Function): void {
    console.warn(
      'Exported Tests: createFragmentSuite is a framework specific function that needs to be defined'
    );
  }

  /**
   * Parses a test suite(s) from imported tests of a given component. Testing framework specific
   * implementation required. For more details/examples see `parsers/BDD.js`
   */
  createInheritedSuite(e: ExportedTest, f: DocumentFragment, i: number): void {
    console.warn(
      'Exported Tests: createInheritedSuite is a framework specific function that needs to be defined'
    );
  }

  /**
   * Converts an individual test in to a testing framework specific test. Testing framework specific
   * implementation required. For more details/examples see `parsers/BDD.js`
   */
  createTest(e: ExportedTest, f: DocumentFragment, i: number): void {
    console.warn(
      'Exported Tests: createTest is a framework specific function that needs to be defined'
    );
  }

  /**
   * Iterates over test suites to parse them in to a specific testing framework.
   * @param {test-suite} tests array of test-suites to be executed on a particular application or page
   * @param {DocumentFragment} fragment document fragment being tested
   * @param {integer} [index] current index when running a `set` of fragments
   */
  parser(tests: TestSuite[]|ExportedTest[], fragment: DocumentFragment, index?: number) {
    // Is possible and okay to have an empty array. In this case the test parser just doesn't do anything
    if (!Array.isArray(tests)) {
      throw new Error('Test parser requires an array of test-suite objects');
    }

    tests.forEach(test => {
      if ((this.constructor as TestParserConstructor).isSuite(test)) {
        const testSuiteType: Function = {
          set: this.createFragmentSuite,
          default: this.createSuite,
        }[(this.constructor as TestParserConstructor).getTestType(test)];

        testSuiteType(test, fragment, index, this.createSuite);
      } else {
        // test is an exported-test
        const testType: Function = {
          set: this.createFragmentSuite,
          inherit: this.createInheritedSuite,
          default: this.getTest,
        }[(this.constructor as TestParserConstructor).getTestType(test)];

        testType(
          test,
          (this.constructor as TestParserConstructor).getFragment(test, fragment),
          index,
          this.getTest
        );
      }
    });
  }
}

export default TestParser;
