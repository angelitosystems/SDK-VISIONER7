import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SDK_VISIONER7_MODULE_OPTIONS } from './constants.js';
import {
  SDKVisioner7ModuleAsyncOptions,
  SDKVisioner7ModuleOptions,
} from './interfaces/index.js';
import { SDKVisioner7Service } from './sdk-visioner7.service.js';

/**
 * NestJS module exposing {@link SDKVisioner7Service}.
 */
@Module({})
export class SDKVisioner7Module {
  /**
   * Synchronous registration, ideal for the root AppModule.
   *
   * @example
   * SDKVisioner7Module.forRoot({
   *   authToken: process.env.SDK_VISIONER7_AUTH_TOKEN,
   *   businessToken: 'v7',
   * })
   */
  static forRoot(options: SDKVisioner7ModuleOptions = {}): DynamicModule {
    return {
      module: SDKVisioner7Module,
      imports: [HttpModule],
      providers: [
        {
          provide: SDK_VISIONER7_MODULE_OPTIONS,
          useValue: options,
        },
        SDKVisioner7Service,
      ],
      exports: [SDKVisioner7Service],
      global: true,
    };
  }

  /**
   * Async registration, useful when configuration depends on
   * ConfigService or another async provider.
   *
   * @example
   * SDKVisioner7Module.forRootAsync({
   *   imports: [ConfigModule],
   *   inject: [ConfigService],
   *   useFactory: (config: ConfigService) => ({
   *     authToken: config.get('SDK_VISIONER7_AUTH_TOKEN'),
   *   }),
   * })
   */
  static forRootAsync(options: SDKVisioner7ModuleAsyncOptions): DynamicModule {
    const asyncOptionsProvider: Provider = {
      provide: SDK_VISIONER7_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: SDKVisioner7Module,
      imports: [HttpModule, ...(options.imports || [])],
      providers: [asyncOptionsProvider, SDKVisioner7Service],
      exports: [SDKVisioner7Service],
      global: true,
    };
  }
}
