import { Context } from './Subito.js';

/**
 * Abstract class service
 *
 * @remarks
 * Use this abstract class when you create a new service use by the {@link Subito} class
 *
 * @public
 */
abstract class Service {
  protected context: Context | undefined;
}

export default Service;
