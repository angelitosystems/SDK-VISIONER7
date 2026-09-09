import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  EstablishmentQueryType,
  GenerateVoucherRequest,
  RemittanceGuideRequest,
  SDKVisioner7Service,
} from '@angelitosystems/sdk-visioner7';

@Controller('sunat')
export class AppController {
  constructor(private readonly sdkVisioner7Service: SDKVisioner7Service) {}

  @Get('ruc/:ruc')
  lookupTaxpayer(@Param('ruc') ruc: string) {
    return this.sdkVisioner7Service.lookupTaxpayer(ruc);
  }

  @Get('ruc/:ruc/fiscal-address')
  lookupFiscalAddress(@Param('ruc') ruc: string) {
    return this.sdkVisioner7Service.lookupEstablishments(
      ruc,
      EstablishmentQueryType.FISCAL_ADDRESS,
    );
  }

  @Get('ruc/:ruc/establishments')
  lookupEstablishments(@Param('ruc') ruc: string) {
    return this.sdkVisioner7Service.lookupEstablishments(
      ruc,
      EstablishmentQueryType.ANNEXED_ESTABLISHMENTS,
    );
  }

  @Get('dni/:dni')
  lookupPerson(@Param('dni') dni: string) {
    return this.sdkVisioner7Service.lookupPerson(dni);
  }

  @Get('exchange-rate/:year/:month')
  getExchangeRate(@Param('year') year: string, @Param('month') month: string) {
    return this.sdkVisioner7Service.getExchangeRate({
      year: Number(year),
      month: Number(month),
    });
  }

  @Post('remittance-guide')
  issueRemittanceGuide(@Body() payload: RemittanceGuideRequest) {
    return this.sdkVisioner7Service.issueRemittanceGuide(payload);
  }

  @Post('voucher')
  generateVoucher(@Body() payload: GenerateVoucherRequest) {
    return this.sdkVisioner7Service.generateVoucher(payload);
  }
}
