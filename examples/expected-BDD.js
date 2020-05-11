/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileOverview snippets of BDD parsed test suites that focus on a specific functionality
 *      of the test parser classes.
 */

/**
 * Examples that use the suiteSetup function
 * (The afterAll/afterEach functions work the exact same way but declare different BDD functions)
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 1: Creates only a beforeEach function
 */
global.beforeEachVariable = 0;
describe('test set with a beforeEach function', () => {
  // START: the following is what is impacted by the testSetup function
  beforeEach(done => {
    global.beforeEachVariable++;
    done();
  });
  // END: the above is what is impacted by the testSetup function

  it('test 1', () => {
    const actual = {
      test: global.beforeEachVariable,
    };
    expect(actual.test).to.equal(1);
  });

  it('test 2', () => {
    const actual = {
      test: global.beforeEachVariable,
    };
    expect(actual.test).to.equal(2);
  });
});

/**
 * Example 2a: Creates only a before function (Using Mocha)
 */
global.beforeAllVariable = 0;
describe('test set with a beforeEach function', () => {
  // START: the following is what is impacted by the testSetup function
  before(done => {
    global.beforeAllVariable++;
    done();
  });
  // END: the above is what is impacted by the testSetup function

  it('test 1', () => {
    const actual = {
      test: global.beforeAllVariable,
    };
    expect(actual.test).to.equal(1);
  });

  it('test 2', () => {
    const actual = {
      test: global.beforeAllVariable,
    };
    expect(actual.test).to.equal(1);
  });
});

/**
 * Example 2b: Creates only a beforeAll function (Using Jest)
 */
global.beforeAllVariable = 0;
describe('test set with a beforeEach function', () => {
  beforeAll(done => {
    global.beforeAllVariable++;
    done();
  });

  it('test 1', () => {
    const actual = {
      test: global.beforeAllVariable,
    };
    expect(actual.test).to.equal(1);
  });

  it('test 2', () => {
    const actual = {
      test: global.beforeAllVariable,
    };
    expect(actual.test).to.equal(1);
  });
});

/**
 * Example 3: Creates both a before (beforeAll) and beforeEach function for the test suite
 * (Using Mocha)
 */
global.beforeEachVariable = 0;
global.beforeAllVariable = 0;
describe('test set with a beforeEach function', () => {
  // START: the following is what is impacted by the testSetup function
  beforeEach(done => {
    global.beforeEachVariable++;
    done();
  });
  before(done => {
    global.beforeAllVariable++;
    done();
  });
  // END: the above is what is impacted by the testSetup function
  it('test 1', () => {
    const actual = {
      all: global.beforeAllVariable,
      each: global.beforeEachVariable,
    };
    expect(actual.all).to.equal(1);
    expect(actual.each).to.equal(1);
  });
  it('test 2', () => {
    const actual = {
      all: global.beforeAllVariable,
      each: global.beforeEachVariable,
    };
    expect(actual.all).to.equal(1);
    expect(actual.each).to.equal(2);
  });
});

/**
 * Examples that use the doParseTest function
 * (conditionals are supported at the test-suite or exported-test level of hierarchy)
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 4: Undefined conditional
 */
it('test with a conditional', () => {
  const actual = {
    test: true,
  };
  expect(actual.test).to.be.true;
});
/**
 * Example 5: Defines a conditional at the test suite level and on an individual test
 */
describe('test set with a conditional', () => {
  it('test 1', () => {
    const actual = {
      test: true,
    };
    expect(actual.test).to.be.true;
  });
  // "test 2 (individual test with conditional)" is not created because it fails the conditional
});

/**
 * Example 6: Conditional that returns false
 */
// "test set with a failing conditional" is not created because it fails the conditional

/**
 * Examples that use the createSuite function
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 7: Standard test suite generation
 */
describe('test set', () => {
  it('test 1', () => {
    const actual = {
      test: true,
    };
    expect(actual.test).to.be.true;
  });

  it('test 2', () => {
    const actual = {
      test: true,
    };
    expect(actual.test).to.be.true;
  });
});

/**
 * Examples that use the createFragmentSuite function
 * (fragment sets are supported at the test-suite or exported-test level of hierarchy)
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 8: Using a fragment set on an individual test
 */
global.setVariable = ['hello', 'world'];
describe('Set index 0', () => {
  it('test with a fragment set', () => {
    const actual = {
      test: 'hello',
      index: 0,
    };
    expect(actual.test).to.equal(global.setVariable[actual.index]);
  });
});

describe('Set index 1', () => {
  it('test with a fragment set', () => {
    const actual = {
      test: 'world',
      index: 1,
    };
    expect(actual.test).to.equal(global.setVariable[actual.index]);
  });
});

/**
 * Example 9: Defines a fragment set at the test suite level
 */
global.setVariable = ['hello', 'world'];
describe('test set with a fragment set', () => {
  describe('Set index 0', () => {
    it('test 1', () => {
      const actual = {
        test: 'hello',
      };
      expect(actual.test).to.be.a('string');
    });
    it('test 2', () => {
      const actual = {
        test: 'hello',
        index: 0,
      };
      expect(actual.test).to.equal(global.setVariable[actual.index]);
    });
  });

  describe('Set index 1', () => {
    it('test with a fragment set', () => {
      const actual = {
        test: 'world',
      };
      expect(actual.test).to.be.a('string');
    });
    it('test 2', () => {
      const actual = {
        test: 'world',
        index: 1,
      };
      expect(actual.test).to.equal(global.setVariable[actual.index]);
    });
  });
});

/**
 * Examples that use the createInheritedSuite function
 * ------------------------------------------------------------------------------------------------
 */

/**
 * Example 10: Test that inherits a separate component test-suite
 */
describe('inherited tests', () => {
  describe('sub-component test-set', () => {
    it('test 1', () => {
      const actual = {
        test: true,
      };

      expect(actual.test).to.be.true;
    });
  });
});
