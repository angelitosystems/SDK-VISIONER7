import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SDKVisioner7Module } from '@angelitosystems/sdk-visioner7';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Option 1: synchronous configuration
    // SDKVisioner7Module.forRoot({
    //   authToken: process.env.SDK_VISIONER7_AUTH_TOKEN,
    //   businessToken: 'v7',
    // }),

    // Option 2: async configuration (recommended)
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
