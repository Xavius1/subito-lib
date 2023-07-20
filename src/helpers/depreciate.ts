import e from '../security/env.js';
import debugMode from './debugMode.js';

// #region Types

interface DeprecationLogger {
  warn(msg: string, ...data:any): void;
}

// #endregion Types

/**
 * A simple logger using console when the logger have not been set.
 */
let deprecateLogger: DeprecationLogger = {
  // eslint-disable-next-line no-console
  warn: console.warn,
};

/**
 * Change the default logger (console) by a custom logger.
 *
 * @param {object} logger - A logger to replace console. The only requirement is
 * that it must implement a warn method.
 */
export function setLogger(logger: DeprecationLogger) {
  if (!logger || (logger && typeof logger !== 'object')) {
    throw new Error('The given logger must be an object.');
  }

  if (typeof logger.warn !== 'function') {
    throw new Error('logger.warn must be a function !');
  }

  deprecateLogger = logger;
}

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
    deprecateLogger.warn(`@Deprecated method "${oldMethod}" called. It must to be replaced by "${newMethod}".`);
  }
};

export default depreciate;
