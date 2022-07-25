import e from '../security/env.js';

/**
 * Define the debug mode based on APP_VALUE & FORCE_DEBUG values
 * @returns
 *
 * @public
 */
const debugMode = () => (e.APP_ENV !== 'production' || e.FORCE_DEBUG);

export default debugMode;
