/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect } from 'chai';
import bindFunctions from '../bind-functions';

describe('bindFunctions applies the class instance to a function', () => {
  class Fixture {
    static myStaticMethod() {
      return this.instanceProperty;
    }

    myInstanceMethod() {
      return this.instanceProperty;
    }

    constructor() {
      this.instanceProperty = 'foo';
      bindFunctions(
        {
          myStaticMethod: this.constructor.myStaticMethod,
          myInstanceMethod: this.myInstanceMethod,
        },
        this,
        ['myStaticMethod']
      );
    }
  }

  it('must work for instance methods', () => {
    const myInstance = new Fixture();
    expect(myInstance.myInstanceMethod).to.be.a('function');
    expect(myInstance.myInstanceMethod()).to.equal('foo');
  });

  it('must work for static methods', () => {
    new Fixture();
    expect(Fixture.myStaticMethod).to.be.a('function');
    expect(Fixture.myStaticMethod()).to.equal('foo');
  });
});
