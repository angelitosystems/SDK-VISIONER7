import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import {
  SDKVisioner7Service,
  TipoConsultaLocal,
  GenerarCpeRequest,
  GuiaRemisionRequest,
} from '@angelitosystems/sdk-visioner7';

@Controller('sunat')
export class AppController {
  constructor(private readonly sdkVisioner7Service: SDKVisioner7Service) {}

  @Get('ruc/:ruc')
  consultarRuc(@Param('ruc') ruc: string) {
    return this.sdkVisioner7Service.consultarRuc(ruc);
  }

  @Get('ruc/:ruc/domicilio-fiscal')
  consultarDomicilioFiscal(@Param('ruc') ruc: string) {
    return this.sdkVisioner7Service.consultarLocalesEstablecimientos(
      ruc,
      TipoConsultaLocal.DOMICILIO_FISCAL,
    );
  }

  @Get('ruc/:ruc/establecimientos-anexos')
  consultarEstablecimientos(@Param('ruc') ruc: string) {
    return this.sdkVisioner7Service.consultarLocalesEstablecimientos(
      ruc,
      TipoConsultaLocal.ESTABLECIMIENTOS_ANEXOS,
    );
  }

  @Get('dni/:dni')
  consultarDni(@Param('dni') dni: string) {
    return this.sdkVisioner7Service.consultarDni(dni);
  }

  @Get('tipo-cambio/:anio/:mes')
  obtenerTipoCambio(
    @Param('anio') anio: string,
    @Param('mes') mes: string,
  ) {
    return this.sdkVisioner7Service.obtenerTipoCambio({
      anio: Number(anio),
      mes: Number(mes),
    });
  }

  @Post('guia-remision')
  emitirGuia(@Body() payload: GuiaRemisionRequest) {
    return this.sdkVisioner7Service.emitirGuiaRemision(payload);
  }

  @Post('generar-cpe')
  generarCpe(@Body() payload: GenerarCpeRequest) {
    return this.sdkVisioner7Service.generarCpe(payload);
  }
}
