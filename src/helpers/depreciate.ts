import e from '../security/env.js';

const depreciate = function warnAboutDepreciateCalledMethod(oldMethod: string, newMethod: string) {
  if (e.APP_ENV !== 'production') {
    console.warn(`@Depreciated method "${oldMethod}"called`); // eslint-disable-line no-console
    console.warn(`It has to be replace by: ${newMethod}`); // eslint-disable-line no-console
  }
};

export default depreciate;
