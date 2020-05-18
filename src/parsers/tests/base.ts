/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import 'mocha';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import TestParser from '../base';
import divHTML from './fixtures/div-html';
import { parserStaticFunctions, parserFunctions } from './fixtures/shared-tests';

/**
 * Options when creating the window/document from the HTML that's being tested
 * @type {object}
 */
const JSDOMoptions = { resources: 'usable' };

/**
 * Adjusts global window and document to be from the HTML we're gonna test
 */
const divWindow = new JSDOM(divHTML, JSDOMoptions).window;

describe('TestParser', () => {
  it('must have all functions', () => {
    expect(TestParser).to.be.a('function');
    parserStaticFunctions(TestParser);
    parserFunctions(new TestParser([], divWindow));
  });

  describe('TestParser.isSuite tests', () => {
    it('returns true if there is an array of tests', () => {
      expect(
        TestParser.isSuite({
          name: 'Test set name',
          tests: [
            {name: 'Test 1'},
            {name: 'Test 2'},
            {name: 'Test 3'}
          ],
        })
      ).to.be.true;
    });

    it('returns false if it is an individual test', () => {
      expect(
        TestParser.isSuite({
          name: 'test name',
        })
      ).to.be.false;
    });
  });

  describe('TestParser.getTestType tests', () => {
    it('returns set there is a fragment function', () => {
      expect(
        TestParser.getTestType({
          name: 'Tests with a fragment set',
          getFragmentSet: () => [{}, {}],
        })
      ).to.equal('set');
    });

    it('returns inherit if there are inherited tests', () => {
      expect(
        TestParser.getTestType({
          name: 'Inherited tests',
          inheritedTests: [
            {
              name: 'Inherited test suite 1',
              tests: [
                { name: 'Inherited test 1'}
              ]
            },
            {
              name: 'Inherited test suite 2',
              tests: [
                { name: 'Inherited test 2'}
              ]
            }
          ],
        })
      ).to.equal('inherit');
    });

    it('returns default if it is a standard test', () => {
      expect(
        TestParser.getTestType({
          name: 'Test name',
        })
      ).to.equal('default');
    });

    it('returns default if it is a standard test set', () => {
      expect(
        TestParser.getTestType({
          name: 'Test set name',
        })
      ).to.equal('default');
    });
  });
});
