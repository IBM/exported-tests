/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @module exportedTests
 * @typicalname Exported Test helpers
 *
 * Exported Tests are a modularized method for writing tests that are framework agnostic. These tests can
 * be ran in any offering and are customizable through configurations passed in to the imported tests.
 * Through the TestParser, users can create a parser for a given testing framework based on their technology stack.
 */

import TestParser from './parsers/base';
import BDDTestParser from './parsers/BDD';

/**
 * Test Developer defined function within Exported Tests to determine if a test (or test suite) should be created.
 * This can be determined by configurations or by parsing a document for specific details (e.g. class names, attributes, etc.)
 * Note: Since this function is related to test creation, it is executed prior to any of the testing framework workflow.
 * @typicalname Conditional Exported Tests
 * @typedef {function} checkConditions
 * @param {DocumentFragment} docFragment fragment being tested
 * @param {Window} [wndw] full window object if needed for interactions
 * @param {integer} [index] index location when used in a set of document fragments
 * @returns {boolean} if the test (or test set) should be created
 */

/**
 * Test Developer defined function within Exported Tests to retrieve a set of document fragments that are used by
 * the test (or test suite). This is typically used when there is a group of similar elements within the UI
 * (e.g. list items, checkbox/radio button groups, etc)
 * Note: Since this function is related to test creation, it is executed prior to any of the testing framework workflow.
 * @typicalname Get a set of DOM fragments for Exported Tests
 * @typedef {function} getFragmentSet
 * @param {DocumentFragment} docFragment fragment to search for set of elements
 * @returns {DocumentFragment[]} document fragment array
 */

/**
 * Test Developer defined function within Exported Tests that retrieves a sub-fragment/child element.
 * By getting a specific sub-fragment, the associated tests are unaware of the parent or sibling elements and the
 * sub-fragment becomes the "root" level. This is most commonly used when nesting test suites through inheritance.
 * (e.g. We want to get the "close modal button" from a Modal so we can re-use Exported Tests from Button)
 * Note: Since this function is related to test creation, it is executed prior to any of the testing framework workflow.
 * @typicalname Get a single DOM fragment for Exported Tests
 * @typedef {function} getSubFragment
 * @param {DocumentFragment} docFragment fragment to search for a child element
 * @returns {DocumentFragment} child element of the original document fragment
 */

/**
 * Test Developer defined function within Exported Tests that is part one in the separation of tasks between data collection
 * and assertions. The use of this function gives developers more control of the type of JavaScript and where it's executed.
 * The `getActual` function collects data points by reading or interacting with element within a document fragment (or window).
 * This function must contain only browser-safe native JavaScript. (Added to support testing frameworks that don't allow
 * browser code within test execution, e.g. Selenium).
 * Note: This function is called as part of the testing framework's test function(e.g. `it` for BDD frameworks).
 * @typicalname Get actual browser results for test
 * @typedef {function} getActual
 * @param {DocumentFragment} docFragment document fragment being tested
 * @param {Window} [wndw] full window object if needed for interactions
 * @returns {Promise} data points that will be compared against Test Developer defined expected values
 */

/**
 * Test Developer defined function within Exported Tests that is the second part in the separation of tasks between
 * data collection and assertions. The `runComparison` function is in charge of any testing assertions performed
 * to verify the data that was gathered via the `getActual` function. This function has no relationship with the DOM.
 * Note: This function is called as part of the testing framework's test function(e.g. `it` for BDD frameworks).
 * @typicalname Run comparison between actual and expected test results
 * @typedef {function} runComparison
 * @param {object} results data points gathered via the getActual function
 */

/**
 * Test Developer defined function within Exported Tests that set ups the window/document for all tests within a test suite
 * and only needs to be executed once per suite. The parameters passed to this function are specific to the testing framework.
 * See `parser-BDD.js` for more details/examples.
 * Note: This function is called as part of the testing framework's setup functionality
 * (e.g. `before`/`beforeAll` for BDD frameworks).
 * @typicalname Browser setup that is executed once before all tests in a suite
 * @typedef {function} beforeAll
 */

/**
 * Test Developer defined function within Exported Tests that set ups the window/document for the test suite and needs to be
 * executed prior to each test within the suite. The parameters passed to this function are specific to the testing framework.
 * See `parser-BDD.js` for more details/examples.
 * Note: This function is called as part of the testing framework's setup functionality (e.g. `beforeEach` for BDD frameworks).
 * @typicalname Browser setup that is executed before every test in a suite
 * @typedef {function} beforeEach
 */

/**
 * Test Developer defined function within Exported Tests that cleans up the window/document for all tests within a test suite
 * and only needs to be executed once after all tests in the suite have been executed. The parameters passed to this function
 * are specific to the testing Framework. See `parser-BDD.js` for more details/examples.
 * Note: This function is called as part of the testing framework's tear down functionality
 * (e.g. `after`/`afterAll` for BDD frameworks).
 * @typicalname Browser cleanup that is executed after all tests within a test suite have completed
 * @typedef {function} afterAll
 */

/**
 * Test Developer defined function within Exported Tests that cleans up the window/document for the test suite and needs to be
 * executed after each test withing the suite. The parameters passed to this function are specific to the testing framework.
 * See `parser-BDD.js` for more details/examples.
 * Note: This function is called as part of the testing framework's tear down functionality
 * (e.g. `afterEach` for BDD frameworks).
 * @typicalname Browser cleanup that is executed after each test within a test suite
 * @typedef {function} afterEach
 */

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

/**
 * Exported Tests that are grouped together in a single suite based on relationship to a single feature/functionality
 * @typicalname Test suite object structure
 * @typedef {object} test-suite
 * @property {string} name Name for the grouping of tests (e.g. In Gherkin this would be the `Feature`,
 *              where in BDD this is the `describe` function)
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
 * @property {exported-test[]} tests array of exported sets that are associated to the common feature/functionality
 */

export { TestParser, BDDTestParser };
