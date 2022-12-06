import Checker from './Checker.js';
import Thrower from './Thrower.js';
import Data from './Data.js';
import type { ParseType } from './Data.js';

const checker = new Checker(true);

/** @public */
export enum EnvType {
  SECRET,
  ENV,
  VAR
}

/** @public */
type SecretEnv = { type?: EnvType, defaultValue: string }

/**
 * @internal
 */
const ensureSecretEnv = function ensureSecretEnv({ type, defaultValue }: SecretEnv) {
  if (type === EnvType.SECRET && defaultValue.length > 5) {
    Thrower.generic('SECRET_ENV_CANT_HAVE_LENGTH_MORE_THAN_FIVE');
  }
};

/** @public */
type DefineEnv = { name: string, type: EnvType, defaultValue: any, fallback?: string }

/**
 * @internal
 */
const canAlias = function canAlias(type: EnvType) {
  const { APP_ENV } = process.env; // eslint-disable-line node/no-process-env

  return (!['staging', 'production'].includes(APP_ENV) || type === EnvType.VAR);
};

/**
 * @internal
 */
const defineEnv = function defineEnv(args: DefineEnv) {
  const {
    name, type, defaultValue, fallback,
  } = args;
  let value = process.env[name]; // eslint-disable-line node/no-process-env

  if (!value && fallback && canAlias(type)) {
    value = process.env[fallback]; // eslint-disable-line node/no-process-env
  }

  if (!value) {
    if (defaultValue === undefined && canAlias(type)) {
      checker.isExists(value, name);
    }
    value = defaultValue;
  }

  return value;
};

/** @public */
export type EnvCustomConfig = {
  allow?: any[], parseType?: ParseType, defaultValue: any, fallback?: string,
}

/** @public */
export type AliasCustomConfig = {
  allow?: any[], defaultValue: any, fallback?: string,
}

/** @public */
export type EnvConfig = {
  allow?: any[], type: EnvType, parseType?: ParseType, defaultValue: any, fallback?: string,
}

/** @public */
export type ReservedEnvVar = [('APP_ENV' | 'NODE_ENV' | 'FORCE_DEBUG' | 'PWD')];
/** @public */
export type EnvRecipe = [string, EnvConfig];
/** @public */
export type EnvRecipes = EnvRecipe[];

/** @public */
export type EnvVars = {
  _recipes: EnvRecipes,
  _defaultValues: { [key: string]: any },
  _allowedValues: { [key: string]: any },
  _fallbacks: { [key: string]: string },
  _types: { [key: string]: EnvType },
  _parseTypes: { [key: string]: ParseType },
  [key: string]: any,
}

/**
 * Handles env vars
 * @public
 */
class Env {
  protected vars: EnvVars = {
    _recipes: [],
    _defaultValues: {},
    _allowedValues: {},
    _fallbacks: {},
    _types: {},
    _parseTypes: {},
  };

  protected reservedList: EnvRecipes = [
    ['NODE_ENV', { type: EnvType.ENV, defaultValue: 'development', allow: ['development', 'test', 'production'] }],
    ['APP_ENV', { type: EnvType.ENV, defaultValue: 'local', allow: ['local', 'current', 'develop', 'integration', 'staging', 'production'] }],
    /**
     * Use this var to activate debug mode on your micro services.
     * It also use by subito packages.
     */
    ['FORCE_DEBUG', { type: EnvType.VAR, defaultValue: false, parseType: 'Bool' }],
    /**
     * If PWD is not set by NodeJS then it will be initialized by Env.
     */
    ['PWD', { type: EnvType.ENV, defaultValue: '/app' }],
    /**
     * Relative build directory
     */
    ['RBD', { type: EnvType.ENV, defaultValue: './lib' }],
    /**
     * Your micro services should use an internal endpoint instead of the client endpoint.
     * Use this var to get the endpoint address.
     */
    ['INTERNAL_GRAPHQL_ENDPOINT', { type: EnvType.ENV, defaultValue: 'http://graphql-endpoint/' }],
    /**
     * All your micro services should have an auth token when calling the api endpoint.
     * Use this var to ask a new token.
     * You have to deploy a micro service to handle new service tokens.
     *
     * To be more secure, you can also use one auth key per micro service.
     * In that case, you will need to sync auth keyes with your auth micro service.
     */
    ['SERVICE_AUTH_KEY', { type: EnvType.SECRET, defaultValue: 'dev' }],
  ];

  protected static get(name: string, {
    allow, type, parseType, defaultValue, fallback,
  }: EnvConfig) {
    ensureSecretEnv({ type, defaultValue });

    const env = defineEnv({
      name, type, defaultValue, fallback,
    });

    let data = null;
    let value = null;
    data = new Data(env);
    value = data.parseType(parseType);

    if (parseType !== 'Bool') {
      checker.isExists(value, name);
    }
    if (allow) {
      checker.isIn(allow, value, name);
    }

    return value;
  }

  /**
   * Get a list of env vars
   *
   * @param recipes - Recipes of the needed vars
   *
   * @remarks
   * Among the returned values, you will get other values.
   * The reserved ones as "NODE_ENV", "APP_ENV" or "FORCE_DEBUG".
   *
   * And thoses that are used by others modules before your script.
   * This way, you are aware of all the env vars used by your app.
   *
   * To be fully flexible, you can change the recipe of a var used by other modules.
   * Only reserved ones can't be customize.
   *
   * @returns
   *
   * @public
   */
  getAll(recipes: EnvRecipes = []): EnvVars {
    const allList = [
      ...recipes,
      ...this.reservedList,
    ];

    const errors: any = [];
    const { _recipes: previousRecipes } = this.vars;
    this.vars._recipes = [...recipes, ...previousRecipes]; // eslint-disable-line no-underscore-dangle, max-len

    allList.forEach(([name, config]) => {
      try {
        this.vars[name] = Env.get(name, config);
        const {
          defaultValue, allow, type, parseType, fallback,
        } = config;
        if (defaultValue || defaultValue === false) {
          this.vars._defaultValues[name] = defaultValue; // eslint-disable-line no-underscore-dangle
        }
        if (allow) {
          this.vars._allowedValues[name] = allow; // eslint-disable-line no-underscore-dangle
        }
        if (type !== undefined) {
          this.vars._types[name] = type; // eslint-disable-line no-underscore-dangle
        }
        if (parseType) {
          this.vars._parseTypes[name] = parseType; // eslint-disable-line no-underscore-dangle
        }
        if (fallback) {
          this.vars._fallbacks[name] = fallback; // eslint-disable-line no-underscore-dangle
        }
      } catch (err: any) {
        errors.push(err.message);
      }
    });

    /* istanbul ignore next */
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return this.vars;
  }

  /**
   * Get the config of a new secret env
   *
   * @param name - The name of the new secret env
   * @returns
   *
   * @public
   */
  newSecret(name: string): EnvRecipe { // eslint-disable-line class-methods-use-this
    return [name.toUpperCase(), { defaultValue: 'dev', type: EnvType.SECRET }];
  }

  /**
   * Get the config of a new environment dependent variable
   *
   * @param name - The name of the new var
   * @param config - Custom env config
   * @returns
   *
   * @public
   */
  newEnv(name: string, config: EnvCustomConfig): EnvRecipe { // eslint-disable-line class-methods-use-this, max-len
    return [name.toUpperCase(), { ...config, type: EnvType.ENV }];
  }

  /**
   * Get the config of a new non-environment dependent variable
   *
   * @param name - The name of the new var
   * @param config - Custom env config
   * @returns
   *
   * @public
   */
  newVar(name: string, config: EnvCustomConfig): EnvRecipe { // eslint-disable-line class-methods-use-this, max-len
    return [name.toUpperCase(), { ...config, type: EnvType.VAR }];
  }

  /**
   * Get the config of a new non-environment dependent Int variable
   *
   * @remarks
   * Alias for:
   * ```
   * newVar('VAR', { parseType: 'Int' });
   * ```
   *
   * @param name - The name of the new int
   * @param config - Custom env config
   * @returns
   *
   * @public
   */
  newInt(name: string, config: AliasCustomConfig): EnvRecipe {
    return this.newVar(name, { ...config, parseType: 'Int' });
  }

  /**
   * Get the config of a new non-environment dependent Float variable
   *
   * @remarks
   * Alias for:
   * ```
   * newVar('VAR', { parseType: 'Float' });
   * ```
   *
   * @param name - The name of the new float
   * @param config - Custom env config
   * @returns
   *
   * @public
   */
  newFloat(name: string, config: AliasCustomConfig): EnvRecipe {
    return this.newVar(name, { ...config, parseType: 'Float' });
  }

  /**
   * Get the config of a new non-environment dependent Array variable
   *
   * @remarks
   * Alias for:
   * ```
   * Env.newVar('VAR', { parseType: 'Array' });
   * ```
   *
   * @example
   * ```
   * Env.newArray('MY_ARRAY', { defaultValue: 'subito,devsecops,micro,services,framework' })
   * // get: ['subito','devsecops','micro','services','framework']
   * ```
   *
   * @param name - The name of the new array
   * @param config - Custom env config
   * @returns
   *
   * @public
   */
  newArray(name: string, config: AliasCustomConfig): EnvRecipe {
    return this.newVar(name, { ...config, parseType: 'Array' });
  }
}

export default new Env();
