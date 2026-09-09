import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import {
  SunatService,
  TipoConsultaLocal,
  GenerarCpeRequest,
  GuiaRemisionRequest,
} from '@angelitosystems/sdk-visioner7';

@Controller('sunat')
export class AppController {
  constructor(private readonly sunatService: SunatService) {}

  @Get('ruc/:ruc')
  consultarRuc(@Param('ruc') ruc: string) {
    return this.sunatService.consultarRuc(ruc);
  }

  @Get('ruc/:ruc/domicilio-fiscal')
  consultarDomicilioFiscal(@Param('ruc') ruc: string) {
    return this.sunatService.consultarLocalesEstablecimientos(
      ruc,
      TipoConsultaLocal.DOMICILIO_FISCAL,
    );
  }

  @Get('ruc/:ruc/establecimientos-anexos')
  consultarEstablecimientos(@Param('ruc') ruc: string) {
    return this.sunatService.consultarLocalesEstablecimientos(
      ruc,
      TipoConsultaLocal.ESTABLECIMIENTOS_ANEXOS,
    );
  }

  @Get('dni/:dni')
  consultarDni(@Param('dni') dni: string) {
    return this.sunatService.consultarDni(dni);
  }

  @Get('tipo-cambio/:anio/:mes')
  obtenerTipoCambio(
    @Param('anio') anio: string,
    @Param('mes') mes: string,
  ) {
    return this.sunatService.obtenerTipoCambio({
      anio: Number(anio),
      mes: Number(mes),
    });
  }

  @Post('guia-remision')
  emitirGuia(@Body() payload: GuiaRemisionRequest) {
    return this.sunatService.emitirGuiaRemision(payload);
  }

  @Post('generar-cpe')
  generarCpe(@Body() payload: GenerarCpeRequest) {
    return this.sunatService.generarCpe(payload);
  }
}
