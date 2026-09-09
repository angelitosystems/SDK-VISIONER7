import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  DEFAULT_BASE_URL,
  DEFAULT_BUSINESS_TOKEN,
  DEFAULT_TIMEOUT,
  SDK_VISIONER7_MODULE_OPTIONS,
} from './constants.js';
import { SDKVisioner7ApiException } from './exceptions/sdk-visioner7-api.exception.js';
import { SDKVisioner7ModuleOptions } from './interfaces/sdk-visioner7-config.interface.js';
import {
  EstablishmentLookupResponse,
  EstablishmentQueryType,
  ExchangeRateRequest,
  ExchangeRateResponse,
  NaturalPersonLookupResponse,
  TaxpayerLookupResponse,
} from './interfaces/lookups.interface.js';
import {
  RemittanceGuideRequest,
  RemittanceGuideResponse,
  RemittanceGuideTicketStatusRequest,
  RemittanceGuideTicketStatusResponse,
} from './interfaces/remittance-guide.interface.js';
import {
  GenerateVoucherRequest,
  GenerateVoucherResponse,
} from './interfaces/voucher.interface.js';
import {
  EstablishmentLookupWireResponse,
  ExchangeRateWireRequest,
  ExchangeRateWireResponse,
  NaturalPersonLookupWireResponse,
  TaxpayerLookupWireResponse,
  fromWireEstablishmentLookupResponse,
  fromWireExchangeRateResponse,
  fromWireNaturalPersonLookupResponse,
  fromWireTaxpayerLookupResponse,
  toWireExchangeRateRequest,
} from './mapping/lookups.mapping.js';
import {
  RemittanceGuideWireResponse,
  fromWireRemittanceGuideResponse,
  toWireRemittanceGuideRequest,
  toWireRemittanceGuideTicketStatusRequest,
} from './mapping/remittance-guide.mapping.js';
import { toWireGenerateVoucherRequest } from './mapping/voucher.mapping.js';
import {
  GenerateVoucherWireResponse,
  fromWireGenerateVoucherResponse,
} from './mapping/voucher-response.mapping.js';

/**
 * Type-safe integration service for the Visioner7 API
 * (SUNAT lookups, electronic vouchers and remittance guides).
 *
 * All public methods accept/return English-typed objects; the SDK maps
 * them to/from the Spanish wire format expected by the provider.
 */
@Injectable()
export class SDKVisioner7Service {
  private readonly logger = new Logger(SDKVisioner7Service.name);
  private readonly baseUrl: string;
  private readonly authToken?: string;
  private readonly businessToken: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    @Inject(SDK_VISIONER7_MODULE_OPTIONS)
    private readonly options: SDKVisioner7ModuleOptions,
  ) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.authToken = options.authToken;
    this.businessToken = options.businessToken ?? DEFAULT_BUSINESS_TOKEN;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  /* ============================================================
   * Lookups
   * ============================================================ */

  /**
   * Looks up taxpayer data by RUC.
   * GET /sunatv1/consultar-ruc/{ruc}
   */
  async lookupTaxpayer(ruc: string | number): Promise<TaxpayerLookupResponse> {
    const url = `${this.baseUrl}/sunatv1/consultar-ruc/${ruc}`;
    const wire = await this.request<TaxpayerLookupWireResponse>('GET', url);
    return fromWireTaxpayerLookupResponse(wire);
  }

  /**
   * Looks up the fiscal address or the annexed establishments of a RUC.
   * GET /sunatv1/locales-establecimientos/{ruc}/{type}
   *
   * @param queryType 1 = fiscal address, 2 = annexed establishments
   */
  async lookupEstablishments(
    ruc: string | number,
    queryType: EstablishmentQueryType | number,
  ): Promise<EstablishmentLookupResponse> {
    const url = `${this.baseUrl}/sunatv1/locales-establecimientos/${ruc}/${queryType}`;
    const wire = await this.request<EstablishmentLookupWireResponse>(
      'GET',
      url,
    );
    return fromWireEstablishmentLookupResponse(wire);
  }

  /**
   * Looks up natural-person data by DNI.
   * GET /sunatv1/consultar-personas/{dni}
   */
  async lookupPerson(
    dni: string | number,
  ): Promise<NaturalPersonLookupResponse> {
    const url = `${this.baseUrl}/sunatv1/consultar-personas/${dni}`;
    const wire = await this.request<NaturalPersonLookupWireResponse>(
      'GET',
      url,
    );
    return fromWireNaturalPersonLookupResponse(wire);
  }

  /**
   * Gets the SUNAT exchange rate (buy/sell) for a given year and month.
   * POST /sunatv1/tipo-cambio
   */
  async getExchangeRate(
    params: ExchangeRateRequest,
  ): Promise<ExchangeRateResponse> {
    const url = `${this.baseUrl}/sunatv1/tipo-cambio`;
    const body: ExchangeRateWireRequest = toWireExchangeRateRequest(
      params,
      this.businessToken,
    );
    const wire = await this.request<ExchangeRateWireResponse>(
      'POST',
      url,
      body,
    );
    return fromWireExchangeRateResponse(wire);
  }

  /* ============================================================
   * Remittance guides
   * ============================================================ */

  /**
   * Issues a remittance guide (public sender, private sender or carrier).
   * The guide "type" depends exclusively on which payload fields are
   * included; see the README for an example of each case.
   * POST /v1/sunat/guia-remision
   */
  async issueRemittanceGuide(
    payload: RemittanceGuideRequest,
  ): Promise<RemittanceGuideResponse> {
    const url = `${this.baseUrl}/v1/sunat/guia-remision`;
    const body = toWireRemittanceGuideRequest(payload);
    const wire = await this.request<RemittanceGuideWireResponse>(
      'POST',
      url,
      body,
    );
    return fromWireRemittanceGuideResponse(wire);
  }

  /**
   * Queries the status of a ticket generated when issuing a guide.
   * POST /v1/sunat/guia-remision/ticket-status
   */
  async getRemittanceGuideTicketStatus(
    payload: RemittanceGuideTicketStatusRequest,
  ): Promise<RemittanceGuideTicketStatusResponse> {
    const url = `${this.baseUrl}/v1/sunat/guia-remision/ticket-status`;
    const body = toWireRemittanceGuideTicketStatusRequest(payload);
    const wire = await this.request<RemittanceGuideWireResponse>(
      'POST',
      url,
      body,
    );
    return fromWireRemittanceGuideResponse(wire);
  }

  /* ============================================================
   * Electronic vouchers (CPE)
   * ============================================================ */

  /**
   * Generates an electronic payment voucher (cash or credit invoice).
   * The operation type depends on the content of `paymentTerms`:
   * a single "Contado" entry, or "Credito" + installments.
   * POST /v1/sunat/generar-cpe
   */
  async generateVoucher(
    payload: GenerateVoucherRequest,
  ): Promise<GenerateVoucherResponse> {
    const url = `${this.baseUrl}/v1/sunat/generar-cpe`;
    const body = toWireGenerateVoucherRequest(payload);
    const wire = await this.request<GenerateVoucherWireResponse>(
      'POST',
      url,
      body,
    );
    return fromWireGenerateVoucherResponse(wire);
  }

  /* ============================================================
   * Helpers
   * ============================================================ */

  private async request<T>(
    method: 'GET' | 'POST',
    url: string,
    data?: unknown,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken
          ? { Authorization: `Bearer ${this.authToken}` }
          : {}),
      },
    };

    const observable =
      method === 'GET'
        ? this.httpService.get<T>(url, config)
        : this.httpService.post<T>(url, data, config);

    const response = await firstValueFrom(
      observable.pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Error calling ${url}: ${error.message}`,
            error.stack,
          );
          throw new SDKVisioner7ApiException(
            error.response?.data
              ? this.extractErrorMessage(error.response.data)
              : error.message,
            url,
            error.response?.data,
          );
        }),
      ),
    );

    return response.data;
  }

  private extractErrorMessage(data: unknown): string {
    if (data && typeof data === 'object') {
      const anyData = data as Record<string, unknown>;
      return (
        (anyData.msj_sunat as string) ||
        (anyData.message as string) ||
        (anyData.error as string) ||
        'Unknown error while querying the SUNAT service'
      );
    }
    return 'Unknown error while querying the SUNAT service';
  }
}
