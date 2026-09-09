import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SunatModule } from 'nestjs-sunat-visioner7-sdk';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Opción 1: configuración síncrona
    // SunatModule.forRoot({
    //   authToken: process.env.SUNAT_AUTH_TOKEN,
    //   businessToken: 'v7',
    // }),

    // Opción 2: configuración asíncrona (recomendada)
    SunatModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseUrl: config.get<string>('SUNAT_BASE_URL'),
        authToken: config.get<string>('SUNAT_AUTH_TOKEN'),
        businessToken: config.get<string>('SUNAT_BUSINESS_TOKEN', 'v7'),
        timeout: 20000,
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
