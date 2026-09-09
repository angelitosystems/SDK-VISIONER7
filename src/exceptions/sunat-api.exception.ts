import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción lanzada cuando la API de Visioner7/SUNAT responde con un
 * error HTTP o con un `success: false` / `cod_sunat` distinto de "0".
 */
export class SunatApiException extends HttpException {
  public readonly providerResponse: unknown;
  public readonly endpoint: string;

  constructor(
    message: string,
    endpoint: string,
    providerResponse?: unknown,
    status: HttpStatus = HttpStatus.BAD_GATEWAY,
  ) {
    super(
      {
        message,
        endpoint,
        providerResponse,
      },
      status,
    );
    this.providerResponse = providerResponse;
    this.endpoint = endpoint;
  }
}
