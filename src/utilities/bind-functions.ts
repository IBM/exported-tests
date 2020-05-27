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
 * @todo Is there a way to have `classInstances` typed to a ES6 class?  I tried Function which is what it's
 *    transpiled to but received TypeScript errors when trying to reference methods and properties
 */
const bindFunctions = (functionObj: object, classInstance): void => {
  Object.keys(functionObj).forEach(name => {
    classInstance[name] = functionObj[name].bind(classInstance);
  });
};

export default bindFunctions;
