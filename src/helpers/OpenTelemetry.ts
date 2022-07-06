import { Resource } from '@opentelemetry/resources';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import e from '../security/env';

type OTExporter = {
  tags: any[]
}

export type OTProps = {
  name: string
  type: string
  exporter?: OTExporter
}

/**
 * Class used to send trace & metrics to an open telemetry backend (only Jaeger for now)
 * Need to be instanciate before anything else
 *
 * @example
 * ```
 * new OpenTelemetry({
 *  type: 'api',
 *   name: 'api-user',
 * }).record();
 * ```
 *
 * @public
 */
class OpenTelemetry {
  private props: OTProps;

  /**
   * @param props - Params used to setup the exporter
   */
  constructor(props: OTProps) {
    this.props = props;

    // if (props.debug) {
    //   diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
    // }
  }

  /**
   * Method used to start to export telemetry
   */
  record() {
    const name = this.props.name ?? this.props.type;

    const instrumentations = [];
    switch (this.props.type) {
      case 'gateway':
        instrumentations.push(new HttpInstrumentation());
        instrumentations.push(new ExpressInstrumentation());
        break;

      case 'api':
        instrumentations.push(new HttpInstrumentation());
        instrumentations.push(new ExpressInstrumentation());
        instrumentations.push(
          new GraphQLInstrumentation({
            allowValues: true,
            depth: 10,
          }),
        );
        instrumentations.push(new AmqplibInstrumentation());
        break;

      case 'consumer':
        instrumentations.push(new AmqplibInstrumentation());
        break;

      default:
        throw new Error(`unknown graph node type: '${this.props.type}'`);
    }

    registerInstrumentations({
      instrumentations,
    });

    const provider = new NodeTracerProvider({
      resource: Resource.default().merge(new Resource({
        'service.name': name,
      })),
    });

    const { exporter } = this.props;
    const tags = exporter?.tags ?? [];

    const jaegerExporter = new JaegerExporter({
      host: e.JAEGER_HOST,
      port: e.JAEGER_PORT,
      tags,
    });

    // const consoleExporter = new ConsoleSpanExporter();
    // provider.addSpanProcessor(
    //   new SimpleSpanProcessor(consoleExporter),
    // );

    // const collectorTraceExporter = new OTLPTraceExporter();
    // provider.addSpanProcessor(
    //   new BatchSpanProcessor(collectorTraceExporter, {
    //     maxQueueSize: 1000,
    //     scheduledDelayMillis: 1000,
    //   }),
    // );

    provider.addSpanProcessor(
      new BatchSpanProcessor(jaegerExporter, {
        maxQueueSize: 1000,
        scheduledDelayMillis: 1000,
      }),
    );

    provider.register();
  }
}

export default OpenTelemetry;
