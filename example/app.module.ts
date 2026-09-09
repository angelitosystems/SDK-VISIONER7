import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SDKVisioner7Module } from '@angelitosystems/sdk-visioner7';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Opción 1: configuración síncrona
    // SDKVisioner7Module.forRoot({
    //   authToken: process.env.SDK_VISIONER7_AUTH_TOKEN,
    //   businessToken: 'v7',
    // }),

    // Opción 2: configuración asíncrona (recomendada)
    SDKVisioner7Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseUrl: config.get<string>('SDK_VISIONER7_BASE_URL'),
        authToken: config.get<string>('SDK_VISIONER7_AUTH_TOKEN'),
        businessToken: config.get<string>('SDK_VISIONER7_BUSINESS_TOKEN', 'v7'),
        timeout: 20000,
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
