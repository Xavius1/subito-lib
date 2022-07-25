import e from '../security/env.js';
import debugMode from './debugMode.js';

/**
 * Print a depreciated warning to the console
 *
 * @param oldMethod - The name of the method to depreciated
 * @param newMethod - The name of the new method to use as replacement
 *
 * @public
 */
const depreciate = function warnAboutDepreciateCalledMethod(oldMethod: string, newMethod: string) {
  if (e.APP_ENV !== 'production' && debugMode()) {
    console.warn(`@Depreciated method "${oldMethod}"called`); // eslint-disable-line no-console
    console.warn(`It has to be replace by: ${newMethod}`); // eslint-disable-line no-console
  }
};

export default depreciate;
