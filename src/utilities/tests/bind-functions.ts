/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import 'mocha';
import { expect } from 'chai';
import bindFunctions from '../bind-functions';

describe('bindFunctions applies the class instance to a function', () => {
  interface FixtureInterface {
    instanceProperty: string,
    myInstanceMethod: Function,
  }

  class Fixture implements FixtureInterface {
    instanceProperty = null;

    myInstanceMethod() {
      return this.instanceProperty;
    }

    constructor() {
      this.instanceProperty = 'foo';
      bindFunctions(
        {
          myInstanceMethod: this.myInstanceMethod,
        },
        this
      );
    }
  }

  it('must work for instance methods', () => {
    const myInstance = new Fixture();
    expect(myInstance.myInstanceMethod).to.be.a('function');
    expect(myInstance.myInstanceMethod()).to.equal('foo');
  });
});
