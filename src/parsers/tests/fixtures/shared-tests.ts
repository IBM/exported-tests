/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';

/**
 * Assertions for static functions that are shared across all TestParser classes
 * @param {TestParser} parser Test parser class (or class that inherits TestParser)
 * @private
 */
const parserStaticFunctions = parser => {
  expect(parser.isSuite).to.be.a('function');
  expect(parser.getTestType).to.be.a('function');
  expect(parser.getFragment).to.be.a('function');
};

/**
 * Assertions for functions that are shared across all TestParser classes
 * @param {TestParser} parser Test parser class (or class that inherits TestParser)
 * @private
 */
const parserFunctions = parser => {
  expect(parser.getTest).to.be.a('function');
  expect(parser.doParseTest).to.be.a('function');
  expect(parser.createSuite).to.be.a('function');
  expect(parser.createFragmentSuite).to.be.a('function');
  expect(parser.createInheritedSuite).to.be.a('function');
  expect(parser.createTest).to.be.a('function');
  expect(parser.parser).to.be.a('function');
};

export {
  parserFunctions,
  parserStaticFunctions,
};
