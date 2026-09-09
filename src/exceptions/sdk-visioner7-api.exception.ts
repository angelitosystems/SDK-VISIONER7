import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when the Visioner7/SUNAT API responds with an HTTP
 * error or with a `success: false` / `sunatCode` other than "0".
 */
export class SDKVisioner7ApiException extends HttpException {
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
