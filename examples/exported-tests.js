/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileOverview snippets of tests in Exported Tests format that focus on a specific functionality
 *      of the test parser classes. The examples would be consistent no matter the
 *      parser used but the output would be different based on the testing framework.
 *      See testing framework `expected-*.js` file for corresponding examples of output
 */

/**
 * Examples that use the suiteSetup function
 * (The afterAll/afterEach functions work the exact same way but declare different BDD functions)
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 1: Creates only a beforeEach function
 * @type {test-suite}
 */
global.beforeEachVariable = 0;
const example1 = {
  name: 'test suite with a beforeEach function',
  beforeEach: done => {
    global.beforeEachVariable++;
    done();
  },
  tests: [
    {
      name: 'test 1',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: global.beforeEachVariable,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.equal(1);
      },
    },
    {
      name: 'test 2',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: global.beforeEachVariable,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.equal(2);
      },
    },
  ],
};

/**
 * Example 2: Creates only a before function (beforeAll for the Jest framework)
 * @type {test-suite}
 */
global.beforeAllVariable = 0;
const example2 = {
  name: 'test suite with a beforeAll function',
  beforeAll: done => {
    global.beforeAllVariable++;
    done();
  },
  tests: [
    {
      name: 'test 1',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: global.beforeAllVariable,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.equal(1);
      },
    },
    {
      name: 'test 2',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: global.beforeAllVariable,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.equal(1);
      },
    },
  ],
};

/**
 * Example 3: Creates both a before (beforeAll) and beforeEach function for the test suite
 * @type {test-suite}
 */
global.beforeAllVariable = 0;
global.beforeEachVariable = 0;
const example3 = {
  name: 'test suite with both beforeEach and beforeAll functions',
  beforeAll: done => {
    global.beforeAllVariable++;
    done();
  },
  beforeEach: done => {
    global.beforeEachVariable++;
    done();
  },
  tests: [
    {
      name: 'test 1',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            all: global.beforeAllVariable,
            each: global.beforeEachVariable,
          });
        }),
      runComparison: actual => {
        expect(actual.all).to.equal(1);
        expect(actual.each).to.equal(1);
      },
    },
    {
      name: 'test 2',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            all: global.beforeAllVariable,
            each: global.beforeEachVariable,
          });
        }),
      runComparison: actual => {
        expect(actual.all).to.equal(1);
        expect(actual.each).to.equal(2);
      },
    },
  ],
};

/**
 * Examples that use the doParseTest function
 * (conditionals are supported at the test-suite or exported-test level of hierarchy)
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 4: Undefined conditional
 * @type {exported-test}
 */
const example4 = {
  name: 'test with a conditional',
  getActual: () =>
    new Promise(resolve => {
      resolve({
        test: true,
      });
    }),
  runComparison: actual => {
    expect(actual.test).to.be.true;
  },
};

/**
 * Example 5: Defines a conditional at the test suite level and on an individual test
 * @type {test-suite}
 */
const example5 = {
  name: 'test suite with a conditional',
  checkConditions: () => {
    return true;
  },
  tests: [
    {
      name: 'test 1',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: true,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.be.true;
      },
    },
    {
      name: 'test 2 (individual test with conditional)',
      checkConditions: () => {
        return false;
      },
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: true,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.be.true;
      },
    },
  ],
};

/**
 * Example 6: Conditional that returns false
 * @type {test-suite}
 */
const example6 = {
  name: 'test suite with a failing conditional',
  checkConditions: () => {
    return false;
  },
  tests: [
    {
      name: 'test 1',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: true,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.be.true;
      },
    },
    {
      name: 'test 2',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: true,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.be.true;
      },
    },
  ],
};

/**
 * Examples that use the createSuite function
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 7: Standard test suite generation
 * @type {test-suite}
 */
const example7 = {
  name: 'test suite',
  tests: [
    {
      name: 'test 1',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: true,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.be.true;
      },
    },
    {
      name: 'test 2',
      getActual: () =>
        new Promise(resolve => {
          resolve({
            test: true,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.be.true;
      },
    },
  ],
};

/**
 * Examples that use the createFragmentSuite function
 * (fragment sets are supported at the test-suite or exported-test level of hierarchy)
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 8: Using a fragment set on an individual test
 * @type {exported-test}
 */
global.setVariable = ['hello', 'world'];
const example8 = {
  name: 'test with a fragment set',
  getFragmentSet: () => {
    return global.setVariable;
  },
  getActual: (frag, _, index) =>
    new Promise(resolve => {
      resolve({
        test: frag,
        index,
      });
    }),
  runComparison: actual => {
    expect(actual.test).to.equal(global.setVariable[actual.index]);
  },
};

/**
 * Example 9: Defines a fragment set at the test suite level
 * @type {test-suite}
 */
global.setVariable = ['hello', 'world'];
const example9 = {
  name: 'test suite with a fragment set',
  getFragmentSet: () => {
    return global.setVariable;
  },
  tests: [
    {
      name: 'test 1',
      getActual: frag =>
        new Promise(resolve => {
          resolve({
            test: frag,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.be.a('string');
      },
    },
    {
      name: 'test 2',
      getActual: (frag, _, index) =>
        new Promise(resolve => {
          resolve({
            test: frag,
            index,
          });
        }),
      runComparison: actual => {
        expect(actual.test).to.equal(global.setVariable[actual.index]);
      },
    },
  ],
};

/**
 * Examples that use the createInheritedSuite function
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 10: Test that inherits a separate component test-suite
 * @type {exported-test}
 */
const example10 = {
  name: 'inherited tests',
  inheritedTests: [
    {
      name: 'sub-component test-suite',
      tests: [
        {
          name: 'test 1',
          getActual: () =>
            new Promise(resolve => {
              resolve({
                test: true,
              });
            }),
          runComparison: actual => {
            expect(actual.test).to.be.true;
          },
        },
      ],
    },
  ],
};

export default {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7,
  example8,
  example9,
  example10,
};
