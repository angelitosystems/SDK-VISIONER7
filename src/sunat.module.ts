import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SUNAT_MODULE_OPTIONS } from './constants';
import {
  SunatModuleAsyncOptions,
  SunatModuleOptions,
} from './interfaces';
import { SunatService } from './sunat.service';

@Module({})
export class SunatModule {
  /**
   * Registro síncrono del módulo, ideal para AppModule raíz.
   *
   * @example
   * SunatModule.forRoot({
   *   authToken: process.env.SUNAT_AUTH_TOKEN,
   *   businessToken: 'v7',
   * })
   */
  static forRoot(options: SunatModuleOptions = {}): DynamicModule {
    return {
      module: SunatModule,
      imports: [HttpModule],
      providers: [
        {
          provide: SUNAT_MODULE_OPTIONS,
          useValue: options,
        },
        SunatService,
      ],
      exports: [SunatService],
      global: true,
    };
  }

  /**
   * Registro asíncrono, útil cuando la configuración depende de
   * ConfigService u otro provider asíncrono.
   *
   * @example
   * SunatModule.forRootAsync({
   *   imports: [ConfigModule],
   *   inject: [ConfigService],
   *   useFactory: (config: ConfigService) => ({
   *     authToken: config.get('SUNAT_AUTH_TOKEN'),
   *   }),
   * })
   */
  static forRootAsync(options: SunatModuleAsyncOptions): DynamicModule {
    const asyncOptionsProvider: Provider = {
      provide: SUNAT_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: SunatModule,
      imports: [HttpModule, ...(options.imports || [])],
      providers: [asyncOptionsProvider, SunatService],
      exports: [SunatService],
      global: true,
    };
  }
}
