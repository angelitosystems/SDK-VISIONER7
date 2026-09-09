/* ============================================================
 * Electronic payment voucher (CPE) generation
 * POST /v1/sunat/generar-cpe
 * ============================================================ */

/**
 * Payment-term entry. The voucher is issued "Contado" (cash) with a single
 * entry, or "Credito" (credit) with one entry plus N installments
 * (Cuota001, Cuota002, ...).
 */
export interface VoucherPaymentTerm {
  /** Payment-form code: "Contado" or "Credito". */
  paymentFormCode: string;
  /** Amount for this term/installment. */
  amount: string;
  /** Required only for credit installments (Cuota001, ...). */
  dueDate?: string;
}

/** A line item of the electronic voucher. */
export interface VoucherItem {
  /** Line number. */
  item: string;
  /** Unit of measure (e.g. NIU). */
  unitOfMeasure: string;
  /** Quantity. */
  quantity: string;
  /** Unit price (with IGV). */
  price: string;
  /** Line total amount (taxable base). */
  amount: string;
  /** Price-type code ("01" = unit price with taxes). */
  priceTypeCode: string;
  /** IGV amount for the line. */
  igv: string;
  /** IGV percentage (e.g. "18.00"). */
  igvPercentage: string;
  /** ISC amount for the line. */
  isc: string;
  /** Line operation-type code ("10" = taxable sale). */
  operationTypeCode: string;
  /** Item SKU/code. */
  code: string;
  /** Item description. */
  description: string;
  /** Price without IGV. */
  priceWithoutIgv: string;
  /** ICBPER flag (plastic-bag tax): 0 or 1. */
  icbperFlag: number;
  /** ICBPER tax amount. */
  icbperTaxAmount: string;
  /** ICBPER total amount. */
  icbperTotalAmount: string;
}

/**
 * Payload to generate an electronic payment voucher (factura electrónica):
 * cash (contado) or credit (crédito) invoice, depending on `paymentTerms`.
 */
export interface GenerateVoucherRequest {
  /** Sale operation type ("0101" = domestic sale). */
  operationType: string;
  /** Total taxable (gravado) amount. */
  totalTaxableAmount: string;
  /** Total untaxed (inafecto) amount. */
  totalUntaxedAmount: string;
  /** Total exempt (exonerado) amount. */
  totalExemptAmount: string;
  /** Total free-of-charge (gratuito) amount. */
  totalFreeAmount: string;
  /** Subtotal. */
  subtotal: string;
  /** Total discount. */
  totalDiscount: string;
  /** IGV percentage (e.g. "18.00"). */
  igvPercentage: string;
  /** Total IGV. */
  totalIgv: string;
  /** Total amount. */
  total: string;
  /** Perceptions subtotal. */
  totalPerceptions?: string;
  /** Perceptions percentage. */
  perceptionsPercentage?: string;
  /** Perceptions taxable base. */
  perceptionsBase?: string;
  /** Perceptions total. */
  perceptionsTotal?: string;
  /** Retentions percentage. */
  retentionsPercentage?: string;
  /** Retentions taxable base. */
  retentionsBase?: string;
  /** Retentions total. */
  retentionsTotal?: string;
  /** Total bonifications. */
  totalBonifications?: string;
  /** Total exports. */
  totalExports?: string;
  /** Payment-method code. */
  paymentMethodCode?: string;
  /** BCRP bank account number. */
  bankAccountNumber?: string;
  /** Detraction code. */
  detractionCode?: string;
  /** Detraction percentage. */
  detractionPercentage?: string;
  /** Detractions total. */
  detractionsTotal?: string;
  /** Total ISC. */
  totalIsc?: string;
  /** Total other charges. */
  totalOtherCharges?: string;
  /** ICBPER total. */
  icbperTotal?: string;
  /** Total in words (e.g. "TRESCIENTOS SESENTA CON 00/100 SOLES"). */
  totalInWords: string;
  /** Remittance-guide number referenced. */
  remittanceGuideNumber?: string;
  /** Remittance-guide type code. */
  remittanceGuideTypeCode?: string;
  /** Remittance-guide date. */
  remittanceGuideDate?: string;
  /** Other reference voucher number. */
  otherVoucherNumber?: string;
  /** Other reference voucher type code. */
  otherVoucherTypeCode?: string;
  /** Amended voucher type code. */
  amendedVoucherTypeCode?: string;
  /** Amended voucher number. */
  amendedVoucherNumber?: string;
  /** Amendment reason type code. */
  amendmentReasonTypeCode?: string;
  /** Amendment reason description. */
  amendmentReasonDescription?: string;
  /** Voucher serial-number (e.g. F001-00000001). */
  voucherNumber: string;
  /** Issue date (YYYY-MM-DD). */
  issueDate: string;
  /** Due date (YYYY-MM-DD). */
  dueDate?: string;
  /** SUNAT voucher type code ("01" = factura, "03" = boleta). */
  voucherTypeCode: string;
  /** Currency code (PEN, USD, ...). */
  currencyCode: string;
  /** Observations. */
  observations?: string;
  /** Payment terms (cash: single entry; credit: entry + installments). */
  paymentTerms: VoucherPaymentTerm[];
  /** Client document number. */
  clientDocumentNumber: string;
  /** Client business/full name. */
  clientBusinessName: string;
  /** Client document type ("1" = DNI, "6" = RUC). */
  clientDocumentType: string;
  /** Client address. */
  clientAddress?: string;
  /** Client ubigeo code. */
  clientUbigeoCode?: string;
  /** Client department. */
  clientDepartment?: string;
  /** Client province. */
  clientProvince?: string;
  /** Client district. */
  clientDistrict?: string;
  /** Client city. */
  clientCity?: string;
  /** Issuer company RUC. */
  companyDocumentNumber: string;
  /** Issuer company document type ("6" = RUC). */
  companyDocumentType: string;
  /** Issuer commercial name. */
  companyCommercialName?: string;
  /** Issuer ubigeo code. */
  companyUbigeoCode?: string;
  /** Issuer address. */
  companyAddress?: string;
  /** Issuer department. */
  companyDepartment?: string;
  /** Issuer province. */
  companyProvince?: string;
  /** Issuer district. */
  companyDistrict?: string;
  /** Issuer country code. */
  companyCountryCode?: string;
  /** Issuer business name. */
  companyBusinessName: string;
  /** Issuer contact person. */
  companyContact?: string;
  /** Issuer phone. */
  companyPhone?: string;
  /** Print format. */
  printFormat?: string;
  /** Anticipation flag. */
  anticipationFlag?: string;
  /** Anticipation regularization flag. */
  anticipationRegularizationFlag?: string;
  /** Anticipation reference voucher number. */
  anticipationReferenceVoucherNumber?: string;
  /** Anticipation regularization currency. */
  anticipationRegularizationCurrency?: string;
  /** Anticipation regularization amount. */
  anticipationRegularizationAmount?: string;
  /** Anticipation regularization total amount. */
  anticipationRegularizationTotalAmount?: string;
  /** Anticipation regularization issuer document type. */
  anticipationRegularizationCompanyDocumentType?: string;
  /** Anticipation regularization issuer document number. */
  anticipationRegularizationCompanyDocumentNumber?: string;
  /** Issuer SUNAT Sol username. */
  companySolUsername: string;
  /** Issuer SUNAT Sol password. */
  companySolPassword: string;
  /** Certificate password (`txtCONTRA`); usually the same value as `signaturePassword`. */
  certificatePassword: string;
  /** Certificate signature password (`txtPAS_FIRMA`). */
  signaturePassword: string;
  /** SUNAT process type ("1" = production, "2" = beta/testing per provider). */
  processType: string;
  /** Voucher line items. */
  items: VoucherItem[];

  /** Allows extra undocumented provider fields without breaking typing. */
  [key: string]: unknown;
}

/** CDR (constancia de recepción) data block. */
export interface VoucherCdrData {
  /** CDR description. */
  description: string;
  /** CDR reference id. */
  referenceId: string;
  /** CDR response code. */
  responseCode: string;
  /** CDR issue date. */
  issueDate: string;
  /** CDR issue time. */
  issueTime: string;
  /** CDR response date. */
  responseDate: string;
  /** CDR response time. */
  responseTime: string;
  /** CDR digest value. */
  digestValue: string;
}

/** Response for voucher generation. */
export interface GenerateVoucherResponse {
  /** Generated file name. */
  file: string;
  /** SUNAT response code ("0" = accepted). */
  sunatCode: string;
  /** SUNAT response message. */
  sunatMessage: string;
  /** CDR hash. */
  cdrHash: string;
  /** CDR data block. */
  cdrData: VoucherCdrData;
}
