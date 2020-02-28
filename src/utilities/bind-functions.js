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
 */
const bindFunctions = (functionObj, classInstance, bindToConstructor = []) => {
    const SELF = classInstance;
  
    Object.keys(functionObj).forEach(name => {
      if (bindToConstructor.includes(name)) {
        SELF.constructor[name] = functionObj[name].bind(SELF);
      } else {
        SELF[name] = functionObj[name].bind(SELF);
      }
    });
  };
  
  export default bindFunctions;
  