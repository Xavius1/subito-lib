import { Context } from './Subito.js';

/**
 * Abstract class repository
 *
 * @remarks
 * Use this abstract class when you create a new repository use by the {@link Subito} class
 *
 * @public
 */
abstract class Repository {
  protected context: Context | undefined;
}

export default Repository;
