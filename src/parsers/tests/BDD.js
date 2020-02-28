/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import BDDTestParser from '../BDD';
import divTests from './fixtures/div-requirements';
import divHTML from './fixtures/div-html';
import JSDOMoptions from './fixtures/jsdom-options';
import { parserStaticFunctions, parserFunctions } from './fixtures/shared-tests';

const testHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Div: Variant One: Preview Layout</title>
</head>
<body>
  <main role="main" id="main-content" style="min-height: 100vh">
    <div class="bx--test bx--test--variant-one">
      <span>Meow unique text</span>
      <p>Cat's meow</p>
      <p class="fails-conditions">Dog's bark</p>
      <p>Bird's tweet</p>
      <input id="test-input" type="checkbox" checked />
    </div>
  </main>
</body>
</html>`;

/**
 * Adjusts global window and document to be from the HTML we're gonna test
 */
const divWindow = new JSDOM(divHTML, JSDOMoptions).window;
const testWindow = new JSDOM(testHTML, JSDOMoptions).window;
const divFrag = divWindow.document.getElementById('main-content');
const testFrag = testWindow.document.getElementById('main-content');

describe('BDDTestParser', () => {
  it('must inherit TestParser functions', () => {
    expect(BDDTestParser).to.be.a('function');
    parserStaticFunctions(BDDTestParser);
    parserFunctions(new BDDTestParser([], divWindow));
  });

  it('must have additional functions', () => {
    const myParser = new BDDTestParser([], divWindow);
    expect(myParser.suiteSetup).to.be.a('function');
    expect(myParser.suiteCleanup).to.be.a('function');
  });

  describe('Runs fixture requirement tests', () => {
    new BDDTestParser(divTests(), divWindow);

    /**
     * @todo Want to verify that this is the actual output of the test parser
     *       as it's the real test to determine if the class is working correctly
     *
     * Expected test output to be:
     *
     *  Div is understandable and unique
     *    ✓ Standard div (from fragment)
     *    ✓ Standard div (from window)
     *    ✓ Interactive elements: Un-check input
     *  Feature 2: Inherited tests
     *    Tests on the div
     *      ✓ Inherited DIV tests
     *  Feature 3: Inherited tests on a child
     *    Tests on the content span
     *      ✓ Inherited SPAN tests
     *  Feature 4: Fragment set on features
     *    Set index: 0
     *      ✓ F4: Scenario 1: should get called 3 times
     *      ✓ F4: Scenario 2: should only be called twice
     *    Set index: 1
     *      ✓ F4: Scenario 1: should get called 3 times
     *    Set index: 2
     *      ✓ F4: Scenario 1: should get called 3 times
     *      ✓ F4: Scenario 2: should only be called twice
     *  Feature 6: conditional is true
     *    ✓ F6: Scenario1
     *  Feature 7: Check the condition for a complete set
     *    Set index: 0
     *      ✓ F7: Scenario1: should be called once
     *  Feature 8: Testing setup/cleanup of feature
     *    ✓ F8: Scenario: 1
     *    ✓ F8: Scenario: 2
     *  Feature 9: Testing setup/cleanup of feature with a set
     *    Set index: 0
     *      ✓ F9: Scenario: 1
     *      ✓ F9: Scenario: 2
     *    Set index: 1
     *      ✓ F9: Scenario: 1
     *      ✓ F9: Scenario: 2
     *    Set index: 2
     *      ✓ F9: Scenario: 1
     *      ✓ F9: Scenario: 2
     */
  });

  describe('Runs fixture requirement tests on a fragment', () => {
    // divTests default `wndw` to use the global Window, so `divFrag` needs to be
    //    the content of the global Window
    before(done => {
      window.document.body.innerHTML = divFrag.outerHTML;
      done();
    });

    new BDDTestParser(divTests(), divFrag);
  });

  describe('Correct window is being tested', () => {
    // Test to verify that the proper use of document fragment and window are getting used in the tests
    // Setup config in the test to take in a class property for the very first
    // test so we are going to scope testing the second window for that test only
    const singleTest = divTests({
      classes: {
        root: 'bx--test',
      },
      inputID: 'test-input',
    })[0];
    new BDDTestParser([singleTest], testWindow);
  });

  describe('Correct window is being tested for a fragment', () => {
    // divTests default `wndw` to use the global Window, so `testFrag` needs to be
    //    the content of the global Window
    before(done => {
      window.document.body.innerHTML = testFrag.outerHTML;
      done();
    });

    // Test to verify that the proper document fragment is getting used in the tests
    // Setup config in the test to take in a class property for the very first
    // test so we are going to scope testing the second window for that test only
    const singleTest = divTests({
      classes: {
        root: 'bx--test',
      },
      inputID: 'test-input',
    })[0];
    new BDDTestParser([singleTest], testFrag);
  });

  describe('window tested is dynamic', () => {});
});
