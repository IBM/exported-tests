/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileOverview Sample Exported Tests test structure
 * Note: this file simplifies the Exported Tests structure for clarity of what is actually part of tests and test suites.
 * In most real-world, use cases an ES6 JavaScript class would be used for encapsulation, inheritance, and flexibility.
 */
import { merge } from 'lodash';
import { expect } from 'chai';
import { TestSuite, ExportedTest } from '../../base';

/**
 * Div Test element structure
 * @typedef {object} elements
 * @property {string} root - root element
 * @property {string} content - inline content container
 * @property {string} paragraphs - paragraph content containers
 * @property {string} input - input element
 */
export interface Elements {
  root?: string;
  content?: string;
  paragraphs?: string;
  input?: string;
}

/**
 * Div Test configurations
 * @typedef {object} config
 * @property {elements} selectors - Selectors to grab each element for the div component
 * @property {elements} classes - classes applied to selectors
 * @property {string} inputID - ID attribute of `INPUT` element
 */
export interface Config {
  selectors?: Elements;
  classes?: Elements;
  inputID?: string;
}

/**
 * Default test configuration
 * @type {config}
 */
const defaults: Config = {
  selectors: {
    root: 'div',
    content: 'span',
    paragraphs: 'p',
    input: 'input',
  },
  classes: {
    root: 'bx--meow',
  },
  inputID: 'my-input',
};

interface DivElements {
  div: Element;
  content: Element;
  pSet: NodeListOf<Element>;
  input: Element|HTMLInputElement;
}

/**
 * Grabs Div component elements from a DOM
 * @param {DocumentFragment} docFragment - JavaScript document or JSDOM fragment
 * @param {elements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getDiv = (docFragment: DocumentFragment, selectors: Elements): DivElements => {
  const div = docFragment.querySelector(selectors.root);
  const content = div.querySelector(selectors.content);
  const pSet = div.querySelectorAll(selectors.paragraphs);
  const input = docFragment.querySelector(selectors.input);

  return {
    div,
    content,
    pSet,
    input,
  };
};

/**
 * Reusable test beforeAll
 * @param {function} done test framework done function
 * @param {DocumentFragment} docFragment JavaScript document or JSDOM fragment
 * @param {Window} wndw=window JavaScript Window object
 */
const beforeAll = (done: Function, docFragment: DocumentFragment, wndw: Window = window): void => {
  const div = wndw.document.createElement('DIV');
  div.classList.add('beforeAll');
  wndw.document.body.appendChild(div);
  done();
};

/**
 * Reusable test beforeEach
 * @param {function} done test framework done function
 * @param {DocumentFragment} docFragment JavaScript document or JSDOM fragment
 * @param {Window} wndw=window JavaScript Window object
 */
const beforeEach = (done: Function, docFragment: DocumentFragment, wndw: Window = window): void => {
  const div = wndw.document.createElement('DIV');
  div.classList.add('beforeEach');
  wndw.document.body.appendChild(div);
  done();
};

/**
 * Reusable test afterAll
 * @param {function} done test framework done function
 * @param {DocumentFragment} docFragment JavaScript document or JSDOM fragment
 * @param {Window} wndw=window JavaScript Window object
 */
const afterAll = (done: Function, docFragment: DocumentFragment, wndw: Window = window): void => {
  const div = wndw.document.createElement('DIV');
  div.classList.add('afterAll');
  wndw.document.body.appendChild(div);
  done();
};

/**
 * Reusable test afterEach
 * @param {function} done test framework done function
 * @param {DocumentFragment} docFragment JavaScript document or JSDOM fragment
 * @param {Window} wndw=window JavaScript Window object
 */
const afterEach = (done: Function, docFragment: DocumentFragment, wndw: Window = window): void => {
  const div = wndw.document.createElement('DIV');
  div.classList.add('afterEach');
  wndw.document.body.appendChild(div);
  done();
};

/**
 * Returns a set of test objects
 * @param {config} config see typedef
 * @return {test-set[]} test objects for use in `testRunner`
 */
const DivTests: Function = (config: Config): (TestSuite|ExportedTest)[] => {
  const settings = merge({}, defaults, config);

  /**
   * Converts the HTML NodeList to an array to support using `querySelector` for flexibility
   * @param {DocumentFragment} docFragment JavaScript document or JSDOM fragment
   * @returns {HTMLElement[]} set of paragraphs in an array
   */
  const getSet = (docFragment): Element[] => {
    const component = getDiv(docFragment, settings.selectors);
    return [...component.pSet];
  };

  return [
    {
      name: 'Div is understandable and unique',
      tests: [
        {
          name: 'Standard div (from fragment)',
          getActual: (docFragment): object =>
            new Promise(resolve => {
              const component = getDiv(docFragment, settings.selectors);

              resolve({
                html: component.div.innerHTML,
                content: component.content.textContent.trim(),
                classes: component.div.classList.value,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.html, "I find said div's content").to.not.be.empty;
            expect(actual.content, 'said content includes text').to.not.be
              .empty;
            expect(actual.classes.split(' ')).to.include(settings.classes.root);
          },
        },
        {
          name: 'Standard div (from window)',
          getActual: (_, wndw = window): object =>
            new Promise(resolve => {
              const component = getDiv(wndw.document, settings.selectors);

              resolve({
                html: component.div.innerHTML,
                content: component.content.textContent.trim(),
                classes: component.div.classList.value,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.html, "I find said div's content").to.not.be.empty;
            expect(actual.content, 'said content includes text').to.not.be
              .empty;
            expect(actual.classes.split(' ')).to.include(settings.classes.root);
          },
        },
        {
          name: 'Interactive elements: Un-check input',
          getActual: (docFragment, wndw = window): object =>
            new Promise(resolve => {
              const component = getDiv(docFragment, settings.selectors);
              const results = {
                inputID: component.input.id,
                initial: (component.input as HTMLInputElement).checked,
                input: wndw.document.getElementById(component.input.id),
                after: null,
              };

              results.input.click();
              results.after = (results.input as HTMLInputElement).checked;

              resolve(results);
            }),
          runComparison: (actual): void => {
            expect(actual.inputID).to.equal(settings.inputID);
            expect(actual.input, 'input should exist in the window').to.exist;
            expect(actual.initial, 'checkbox is checked by default').to.be.true;
            expect(actual.after, 'checkbox is unchecked after clicking on it')
              .to.be.false;
          },
        },
      ],
    },
    {
      name: 'Feature 2: Inherited tests',
      inheritedTests: [
        {
          name: 'Tests on the div',
          tests: [
            {
              name: 'Inherited DIV tests',
              getActual: (docFragment): object =>
                new Promise(resolve => {
                  resolve({
                    tag: docFragment.querySelector(settings.selectors.root)
                      .tagName,
                  });
                }),
              runComparison: (actual): void => {
                expect(actual.tag, 'div tag name').to.equal('DIV');
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Feature 3: Inherited tests on a child',
      getSubFragment: (docFragment): Element => {
        const component = getDiv(docFragment, settings.selectors);
        return component.content;
      },
      inheritedTests: [
        {
          name: 'Tests on the content span',
          tests: [
            {
              name: 'Inherited SPAN tests',
              getActual: (docFragment): object =>
                new Promise(resolve => {
                  resolve({
                    tag: docFragment.tagName,
                  });
                }),
              runComparison: (actual): void => {
                expect(actual.tag, 'span tag name').to.equal('SPAN');
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Feature 4: Fragment set on features',
      getFragmentSet: getSet,
      tests: [
        {
          name: 'F4: Scenario 1: should get called 3 times',
          getActual: (): object =>
            new Promise(resolve => {
              resolve({
                test: true,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.test, 'custom error message').to.be.true;
          },
        },
        {
          name: 'F4: Scenario 2: should only be called twice',
          checkConditions: (docFragment): boolean => {
            return !docFragment.classList.contains('fails-conditions');
          },
          getActual: (): object =>
            new Promise(resolve => {
              resolve({
                test: true,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.test, 'should be called 2 times').to.be.true;
          },
        },
      ],
    },
    {
      name:
        '---------------------------SHOULD NOT SHOW UP--------------------------- Feature 5',
      checkConditions: (): boolean => false,
      tests: [
        {
          name:
            '---------------------------SHOULD NOT SHOW UP--------------------------- F5: Scenario 1',
          getActual: (): object =>
            new Promise(resolve => {
              resolve({
                test: true,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.test, 'custom error message').to.be.false;
          },
        },
        {
          name:
            '---------------------------SHOULD NOT SHOW UP--------------------------- F5: Scenario 2',
          getActual: (): object =>
            new Promise(resolve => {
              resolve({
                test: true,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.test, 'custom error message').to.be.false;
          },
        },
      ],
    },
    {
      name: 'Feature 6: conditional is true',
      checkConditions: (): boolean => true,
      tests: [
        {
          name: 'F6: Scenario1 ',
          getActual: (): object =>
            new Promise(resolve => {
              resolve({
                test: true,
              });
            }),
          runComparison: (actual): void => {
            expect(
              actual.test,
              'Scenario test should run when conditional is true'
            ).to.be.true;
          },
        },
      ],
    },
    {
      name: 'Feature 7: Check the condition for a complete set',
      checkConditions: (_, x, index): boolean => {
        return index % 3 === 0;
      },
      getFragmentSet: getSet,
      tests: [
        {
          name: 'F7: Scenario1: should be called once ',
          getActual: (): object =>
            new Promise(resolve => {
              resolve({
                test: true,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.test).to.be.true;
          },
        },
      ],
    },
    {
      name: 'Feature 8: Testing setup/cleanup of feature',
      beforeEach,
      beforeAll,
      afterEach,
      afterAll,
      tests: [
        {
          name: 'F8: Scenario: 1',
          getActual: (_, wndw = window): object =>
            new Promise(resolve => {
              const bEDivs = wndw.document.body.getElementsByClassName(
                'beforeEach'
              ).length;
              const bADivs = wndw.document.body.getElementsByClassName(
                'beforeAll'
              ).length;
              const aEDivs = wndw.document.body.getElementsByClassName(
                'afterEach'
              ).length;
              const aADivs = wndw.document.body.getElementsByClassName(
                'afterAll'
              ).length;
              resolve({
                bEDivs,
                bADivs,
                aEDivs,
                aADivs,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.bEDivs).to.equal(1);
            expect(actual.bADivs).to.equal(1);
            expect(actual.aEDivs).to.equal(0);
            expect(actual.aADivs).to.equal(0);
          },
        },
        {
          name: 'F8: Scenario: 2',
          getActual: (_, wndw = window): object =>
            new Promise(resolve => {
              const bEDivs = wndw.document.body.getElementsByClassName(
                'beforeEach'
              ).length;
              const bADivs = wndw.document.body.getElementsByClassName(
                'beforeAll'
              ).length;
              const aEDivs = wndw.document.body.getElementsByClassName(
                'afterEach'
              ).length;
              const aADivs = wndw.document.body.getElementsByClassName(
                'afterAll'
              ).length;
              resolve({
                bEDivs,
                bADivs,
                aEDivs,
                aADivs,
              });
            }),
          runComparison: (actual): void => {
            expect(actual.bEDivs).to.equal(2);
            expect(actual.bADivs).to.equal(1);
            expect(actual.aEDivs).to.equal(1);
            expect(actual.aADivs).to.equal(0);
          },
        },
      ],
    },
    {
      name: 'Feature 9: Testing setup/cleanup of feature with a set',
      beforeEach,
      beforeAll,
      afterEach,
      afterAll,
      getFragmentSet: getSet,
      tests: [
        {
          name: 'F9: Scenario: 1',
          getActual: (_, wndw = window, index): object =>
            new Promise(resolve => {
              const bEDivs = wndw.document.body.getElementsByClassName(
                'beforeEach'
              ).length;
              const bADivs = wndw.document.body.getElementsByClassName(
                'beforeAll'
              ).length;
              const aEDivs = wndw.document.body.getElementsByClassName(
                'afterEach'
              ).length;
              const aADivs = wndw.document.body.getElementsByClassName(
                'afterAll'
              ).length;
              resolve({
                bEDivs,
                bADivs,
                aEDivs,
                aADivs,
                index,
              });
            }),
          runComparison: (actual): void => {
            const numOfTests = 2;
            expect(actual.bADivs).to.equal(2);
            expect(actual.aADivs).to.equal(1);
            expect(actual.bEDivs).to.equal(3 + actual.index * numOfTests);
            expect(actual.aEDivs).to.equal(2 + actual.index * numOfTests);
          },
        },
        {
          name: 'F9: Scenario: 2',
          getActual: (_, wndw = window, index): object =>
            new Promise(resolve => {
              const bEDivs = wndw.document.body.getElementsByClassName(
                'beforeEach'
              ).length;
              const bADivs = wndw.document.body.getElementsByClassName(
                'beforeAll'
              ).length;
              const aEDivs = wndw.document.body.getElementsByClassName(
                'afterEach'
              ).length;
              const aADivs = wndw.document.body.getElementsByClassName(
                'afterAll'
              ).length;
              resolve({
                bEDivs,
                bADivs,
                aEDivs,
                aADivs,
                index,
              });
            }),
          runComparison: (actual): void => {
            const numOfTests = 2;
            expect(actual.bADivs).to.equal(2);
            expect(actual.aADivs).to.equal(1);
            expect(actual.bEDivs).to.equal(4 + actual.index * numOfTests);
            expect(actual.aEDivs).to.equal(3 + actual.index * numOfTests);
          },
        },
      ],
    },
  ];
};

export default DivTests;
