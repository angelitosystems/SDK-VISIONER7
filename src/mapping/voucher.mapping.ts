/**
 * Wire types (Spanish field names) for electronic payment vouchers
 * (comprobantes de pago electrónicos) and their request mappers.
 */

import {
  GenerateVoucherRequest,
  VoucherItem,
  VoucherPaymentTerm,
} from '../interfaces/voucher.interface.js';

/* ============================================================
 * Wire types
 * ============================================================ */

/** Wire payment-term entry (`detalle_forma_pago`). */
export interface VoucherPaymentTermWire {
  COD_FORMA_PAGO: string;
  MONTO_FORMA_PAGO: string;
  FECHA_FORMA_PAGO?: string;
}

/** Wire line item (`detalle`). */
export interface VoucherItemWire {
  txtITEM: string;
  txtUNIDAD_MEDIDA_DET: string;
  txtCANTIDAD_DET: string;
  txtPRECIO_DET: string;
  txtIMPORTE_DET: string;
  txtPRECIO_TIPO_CODIGO: string;
  txtIGV: string;
  POR_IGV: string;
  txtISC: string;
  txtCOD_TIPO_OPERACION: string;
  txtCODIGO_DET: string;
  txtDESCRIPCION_DET: string;
  txtPRECIO_SIN_IGV_DET: string;
  FLG_ICBPER: number;
  IMPUESTO_BP: string;
  IMPORTE_BP: string;
}

/** Wire payload for POST /v1/sunat/generar-cpe. */
export interface GenerateVoucherWireRequest {
  txtTIPO_OPERACION: string;
  txtTOTAL_GRAVADAS: string;
  txtTOTAL_INAFECTA: string;
  txtTOTAL_EXONERADAS: string;
  txtTOTAL_GRATUITAS: string;
  txtSUB_TOTAL: string;
  txtTOTAL_DESCUENTO: string;
  txtPOR_IGV: string;
  txtTOTAL_IGV: string;
  txtTOTAL: string;
  txtSUB_TOTAL_PERCEPCIONES?: string;
  txtPOR_PERCEPCIONES?: string;
  txtBI_PERCEPCIONES?: string;
  txtTOTAL_PERCEPCIONES?: string;
  txtPOR_RETENCIONES?: string;
  txtBI_RETENCIONES?: string;
  txtTOTAL_RETENCIONES?: string;
  txtTOTAL_BONIFICACIONES?: string;
  txtTOTAL_EXPORTACION?: string;
  txtCOD_MEDIO_PAGO?: string;
  txtCTA_BANCARIA_BN?: string;
  txtCODIGO_DETRACCION?: string;
  txtPOR_DETRACCION?: string;
  txtTOTAL_DETRACCIONES?: string;
  txtTOTAL_ISC?: string;
  txtTOTAL_OTR_IMP?: string;
  ICBP?: string;
  txtTOTAL_LETRAS: string;
  txtNRO_GUIA_REMISION?: string;
  txtCOD_GUIA_REMISION?: string;
  txtFECHA_GUIA_REMISION?: string;
  txtNRO_OTR_COMPROBANTE?: string;
  txtCOD_OTR_COMPROBANTE?: string;
  txtTIPO_COMPROBANTE_MODIFICA?: string;
  txtNRO_DOCUMENTO_MODIFICA?: string;
  txtCOD_TIPO_MOTIVO?: string;
  txtDESCRIPCION_MOTIVO?: string;
  txtNRO_COMPROBANTE: string;
  txtFECHA_DOCUMENTO: string;
  txtFECHA_VTO?: string;
  txtCOD_TIPO_DOCUMENTO: string;
  txtCOD_MONEDA: string;
  txtOBSERVACIONES?: string;
  detalle_forma_pago: VoucherPaymentTermWire[];
  txtNRO_DOCUMENTO_CLIENTE: string;
  txtRAZON_SOCIAL_CLIENTE: string;
  txtTIPO_DOCUMENTO_CLIENTE: string;
  txtDIRECCION_CLIENTE?: string;
  txtCOD_UBIGEO_CLIENTE?: string;
  txtDEPARTAMENTO_CLIENTE?: string;
  txtPROVINCIA_CLIENTE?: string;
  txtDISTRITO_CLIENTE?: string;
  txtCIUDAD_CLIENTE?: string;
  txtNRO_DOCUMENTO_EMPRESA: string;
  txtTIPO_DOCUMENTO_EMPRESA: string;
  txtNOMBRE_COMERCIAL_EMPRESA?: string;
  txtCODIGO_UBIGEO_EMPRESA?: string;
  txtDIRECCION_EMPRESA?: string;
  txtDEPARTAMENTO_EMPRESA?: string;
  txtPROVINCIA_EMPRESA?: string;
  txtDISTRITO_EMPRESA?: string;
  txtCODIGO_PAIS_EMPRESA?: string;
  txtRAZON_SOCIAL_EMPRESA: string;
  txtCONTACTO_EMPRESA?: string;
  txtTELEFONO_EMPRESA?: string;
  txtFORMATO_IMPRESION?: string;
  txtFLG_ANTICIPO?: string;
  txtFLG_REGU_ANTICIPO?: string;
  txtNRO_COMPROBANTE_REF_ANT?: string;
  txtMONEDA_REGU_ANTICIPO?: string;
  txtMONTO_REGU_ANTICIPO?: string;
  txtMONTO_REGU_ANTICIPO_TOTAL?: string;
  txtTIPO_DOCUMENTO_EMP_REGU_ANT?: string;
  txtNRO_DOCUMENTO_EMP_REGU_ANT?: string;
  txtUSUARIO_SOL_EMPRESA: string;
  txtPASS_SOL_EMPRESA: string;
  txtCONTRA: string;
  txtPAS_FIRMA: string;
  txtTIPO_PROCESO: string;
  detalle: VoucherItemWire[];

  [key: string]: unknown;
}

/* ============================================================
 * Request mappers
 * ============================================================ */

export function toWireVoucherPaymentTerm(
  term: VoucherPaymentTerm,
): VoucherPaymentTermWire {
  return {
    COD_FORMA_PAGO: term.paymentFormCode,
    MONTO_FORMA_PAGO: term.amount,
    FECHA_FORMA_PAGO: term.dueDate,
  };
}

export function toWireVoucherItem(item: VoucherItem): VoucherItemWire {
  return {
    txtITEM: item.item,
    txtUNIDAD_MEDIDA_DET: item.unitOfMeasure,
    txtCANTIDAD_DET: item.quantity,
    txtPRECIO_DET: item.price,
    txtIMPORTE_DET: item.amount,
    txtPRECIO_TIPO_CODIGO: item.priceTypeCode,
    txtIGV: item.igv,
    POR_IGV: item.igvPercentage,
    txtISC: item.isc,
    txtCOD_TIPO_OPERACION: item.operationTypeCode,
    txtCODIGO_DET: item.code,
    txtDESCRIPCION_DET: item.description,
    txtPRECIO_SIN_IGV_DET: item.priceWithoutIgv,
    FLG_ICBPER: item.icbperFlag,
    IMPUESTO_BP: item.icbperTaxAmount,
    IMPORTE_BP: item.icbperTotalAmount,
  };
}

export function toWireGenerateVoucherRequest(
  request: GenerateVoucherRequest,
): GenerateVoucherWireRequest {
  return {
    txtTIPO_OPERACION: request.operationType,
    txtTOTAL_GRAVADAS: request.totalTaxableAmount,
    txtTOTAL_INAFECTA: request.totalUntaxedAmount,
    txtTOTAL_EXONERADAS: request.totalExemptAmount,
    txtTOTAL_GRATUITAS: request.totalFreeAmount,
    txtSUB_TOTAL: request.subtotal,
    txtTOTAL_DESCUENTO: request.totalDiscount,
    txtPOR_IGV: request.igvPercentage,
    txtTOTAL_IGV: request.totalIgv,
    txtTOTAL: request.total,
    txtSUB_TOTAL_PERCEPCIONES: request.totalPerceptions,
    txtPOR_PERCEPCIONES: request.perceptionsPercentage,
    txtBI_PERCEPCIONES: request.perceptionsBase,
    txtTOTAL_PERCEPCIONES: request.perceptionsTotal,
    txtPOR_RETENCIONES: request.retentionsPercentage,
    txtBI_RETENCIONES: request.retentionsBase,
    txtTOTAL_RETENCIONES: request.retentionsTotal,
    txtTOTAL_BONIFICACIONES: request.totalBonifications,
    txtTOTAL_EXPORTACION: request.totalExports,
    txtCOD_MEDIO_PAGO: request.paymentMethodCode,
    txtCTA_BANCARIA_BN: request.bankAccountNumber,
    txtCODIGO_DETRACCION: request.detractionCode,
    txtPOR_DETRACCION: request.detractionPercentage,
    txtTOTAL_DETRACCIONES: request.detractionsTotal,
    txtTOTAL_ISC: request.totalIsc,
    txtTOTAL_OTR_IMP: request.totalOtherCharges,
    ICBP: request.icbperTotal,
    txtTOTAL_LETRAS: request.totalInWords,
    txtNRO_GUIA_REMISION: request.remittanceGuideNumber,
    txtCOD_GUIA_REMISION: request.remittanceGuideTypeCode,
    txtFECHA_GUIA_REMISION: request.remittanceGuideDate,
    txtNRO_OTR_COMPROBANTE: request.otherVoucherNumber,
    txtCOD_OTR_COMPROBANTE: request.otherVoucherTypeCode,
    txtTIPO_COMPROBANTE_MODIFICA: request.amendedVoucherTypeCode,
    txtNRO_DOCUMENTO_MODIFICA: request.amendedVoucherNumber,
    txtCOD_TIPO_MOTIVO: request.amendmentReasonTypeCode,
    txtDESCRIPCION_MOTIVO: request.amendmentReasonDescription,
    txtNRO_COMPROBANTE: request.voucherNumber,
    txtFECHA_DOCUMENTO: request.issueDate,
    txtFECHA_VTO: request.dueDate,
    txtCOD_TIPO_DOCUMENTO: request.voucherTypeCode,
    txtCOD_MONEDA: request.currencyCode,
    txtOBSERVACIONES: request.observations,
    detalle_forma_pago: request.paymentTerms.map(toWireVoucherPaymentTerm),
    txtNRO_DOCUMENTO_CLIENTE: request.clientDocumentNumber,
    txtRAZON_SOCIAL_CLIENTE: request.clientBusinessName,
    txtTIPO_DOCUMENTO_CLIENTE: request.clientDocumentType,
    txtDIRECCION_CLIENTE: request.clientAddress,
    txtCOD_UBIGEO_CLIENTE: request.clientUbigeoCode,
    txtDEPARTAMENTO_CLIENTE: request.clientDepartment,
    txtPROVINCIA_CLIENTE: request.clientProvince,
    txtDISTRITO_CLIENTE: request.clientDistrict,
    txtCIUDAD_CLIENTE: request.clientCity,
    txtNRO_DOCUMENTO_EMPRESA: request.companyDocumentNumber,
    txtTIPO_DOCUMENTO_EMPRESA: request.companyDocumentType,
    txtNOMBRE_COMERCIAL_EMPRESA: request.companyCommercialName,
    txtCODIGO_UBIGEO_EMPRESA: request.companyUbigeoCode,
    txtDIRECCION_EMPRESA: request.companyAddress,
    txtDEPARTAMENTO_EMPRESA: request.companyDepartment,
    txtPROVINCIA_EMPRESA: request.companyProvince,
    txtDISTRITO_EMPRESA: request.companyDistrict,
    txtCODIGO_PAIS_EMPRESA: request.companyCountryCode,
    txtRAZON_SOCIAL_EMPRESA: request.companyBusinessName,
    txtCONTACTO_EMPRESA: request.companyContact,
    txtTELEFONO_EMPRESA: request.companyPhone,
    txtFORMATO_IMPRESION: request.printFormat,
    txtFLG_ANTICIPO: request.anticipationFlag,
    txtFLG_REGU_ANTICIPO: request.anticipationRegularizationFlag,
    txtNRO_COMPROBANTE_REF_ANT: request.anticipationReferenceVoucherNumber,
    txtMONEDA_REGU_ANTICIPO: request.anticipationRegularizationCurrency,
    txtMONTO_REGU_ANTICIPO: request.anticipationRegularizationAmount,
    txtMONTO_REGU_ANTICIPO_TOTAL: request.anticipationRegularizationTotalAmount,
    txtTIPO_DOCUMENTO_EMP_REGU_ANT:
      request.anticipationRegularizationCompanyDocumentType,
    txtNRO_DOCUMENTO_EMP_REGU_ANT:
      request.anticipationRegularizationCompanyDocumentNumber,
    txtUSUARIO_SOL_EMPRESA: request.companySolUsername,
    txtPASS_SOL_EMPRESA: request.companySolPassword,
    txtCONTRA: request.certificatePassword,
    txtPAS_FIRMA: request.signaturePassword,
    txtTIPO_PROCESO: request.processType,
    detalle: request.items.map(toWireVoucherItem),
  };
}
