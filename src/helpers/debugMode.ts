import e from '../security/env';

const debugMode = () => (e.APP_ENV !== 'production' || e.FORCE_DEBUG);

export default debugMode;
