import argv from 'argv';

export type SubitoInput = {
  dataSources?: { [key: string]: any }
  services?: { [key: string]: any }
  debug?: boolean
}

export type Context = {
  dataSources: { [key: string]: any }
  services: { [key: string]: any }
  debug: boolean
}

export type CommandOption = {
  name: string,
  type: string,
  short?: string | undefined,
  description?: string | undefined,
  example?: string | undefined
}

/**
 * Create a new Subito app
 * @public
 */
class Subito {
  commandOptions: { [key: string]: any; } = {};

  context: Context;

  constructor(input: SubitoInput, commandOptions?: CommandOption | CommandOption[]) {
    this.context = {
      dataSources: {}, services: {}, debug: false, ...input,
    };

    if (commandOptions) {
      argv.option(commandOptions);
      this.readOptions();
    }

    Object.keys(this.context.dataSources).forEach((source) => {
      this.context.dataSources[source].context = this.context;
    });

    Object.keys(this.context.services).forEach((source) => {
      this.context.services[source].context = this.context;
    });
  }

  /**
   * Read command options
   * @internal
   */
  protected readOptions() {
    const args = process.argv.slice(2);
    const { options } = argv.run(args);
    this.commandOptions = options;

    return this;
  }
}

export default Subito;
