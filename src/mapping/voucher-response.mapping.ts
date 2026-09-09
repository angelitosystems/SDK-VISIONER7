/**
 * Wire response types (Spanish field names) for electronic payment
 * vouchers and their mappers.
 */

import {
  GenerateVoucherResponse,
  VoucherCdrData,
} from '../interfaces/voucher.interface.js';

/** Wire CDR data block (`cdr_data`). */
export interface VoucherCdrDataWire {
  description: string;
  reference_id: string;
  response_code: string;
  issue_date: string;
  issue_time: string;
  response_date: string;
  response_time: string;
  digest_value: string;
}

/** Wire response for POST /v1/sunat/generar-cpe. */
export interface GenerateVoucherWireResponse {
  archivo: string;
  cod_sunat: string;
  msj_sunat: string;
  hash_cdr: string;
  cdr_data: VoucherCdrDataWire;
}

export function fromWireVoucherCdrData(
  wire: VoucherCdrDataWire,
): VoucherCdrData {
  return {
    description: wire.description,
    referenceId: wire.reference_id,
    responseCode: wire.response_code,
    issueDate: wire.issue_date,
    issueTime: wire.issue_time,
    responseDate: wire.response_date,
    responseTime: wire.response_time,
    digestValue: wire.digest_value,
  };
}

export function fromWireGenerateVoucherResponse(
  wire: GenerateVoucherWireResponse,
): GenerateVoucherResponse {
  return {
    file: wire.archivo,
    sunatCode: wire.cod_sunat,
    sunatMessage: wire.msj_sunat,
    cdrHash: wire.hash_cdr,
    cdrData: fromWireVoucherCdrData(wire.cdr_data),
  };
}
