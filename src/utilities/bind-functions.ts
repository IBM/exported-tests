/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Bind ES6 class instance to public functions for proper use of `this` within the function
 * @param  {object} functionObj object of functions to bind with the function name as the object key
 * @param  {class} classInstance ES6 class instance (`this`)
 * @param  {string[]} classInstance list of functions that should bound to the class constructor instead of
 *            the specific instance
 * @todo is there a way to define `classInstance` as a generic CS6 class?
 *    If I define it as a Function (which is what a Class transpiled to),
 *    it throws and error in `base.ts` when we pass `this` which is a TestParser
 */
const bindFunctions = (functionObj: object, classInstance: any, bindToConstructor: string[] = []): void => {
    const SELF = classInstance;

    Object.keys(functionObj).forEach((name: string) => {
      if (bindToConstructor.includes(name)) {
        SELF.constructor[name] = functionObj[name].bind(SELF);
      } else {
        SELF[name] = functionObj[name].bind(SELF);
      }
    });
  };

  export default bindFunctions;
