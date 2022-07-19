import e from '../security/env.js';

const debugMode = () => (e.APP_ENV !== 'production' || e.FORCE_DEBUG);

export default debugMode;
