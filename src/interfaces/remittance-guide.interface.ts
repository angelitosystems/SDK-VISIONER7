/* ============================================================
 * Remittance guide (guía de remisión) emission
 * POST /v1/sunat/guia-remision
 * ============================================================ */

/** A line item transported by the remittance guide. */
export interface RemittanceGuideItem {
  /** Line number. */
  item: string;
  /** Unit of measure (e.g. NIU = units). */
  unitOfMeasure: string;
  /** Quantity. */
  quantity: string;
  /** Sort order of the line. */
  orderItem: string;
  /** Item description. */
  description: string;
  /** Item SKU/code. */
  code: string;
}

/**
 * Payload to issue a remittance guide (guía de remisión electrónica).
 * Optional fields depend on the guide type:
 * - PUBLIC_SENDER / PRIVATE_SENDER / CARRIER — see the provider docs.
 */
export interface RemittanceGuideRequest {
  /** SUNAT process type ("1" = production, "2" = beta/testing per provider). */
  processType: string;
  /** Issuer company RUC. */
  companyDocumentNumber: string;
  /** Issuer SUNAT Sol username. */
  companySolUsername: string;
  /** Issuer SUNAT Sol password. */
  companySolPassword: string;
  /** Certificate signature password. */
  signaturePassword: string;
  /** SUNAT document type code ("09" = remittance guide). */
  documentTypeCode: string;
  /** Guide serial-number (e.g. T001-00000002). */
  documentNumber: string;
  /** Provider ID token. */
  idToken: string;
  /** Provider token key. */
  tokenKey: string;
  /** Issue date (YYYY-MM-DD). */
  documentDate: string;
  /** Optional note. */
  note?: string;
  /** Issuer company document type ("6" = RUC). */
  companyDocumentType: string;
  /** Issuer business name. */
  companyBusinessName: string;
  /** Recipient document type ("6" = RUC, "1" = DNI). */
  recipientDocumentType: string;
  /** Recipient document number. */
  recipientDocumentNumber: string;
  /** Recipient business/full name. */
  recipientBusinessName: string;
  /** Shipment line number. */
  shipmentItem: string;
  /** SUNAT transfer-reason code (COD_MOTIVO_TRASLADO). */
  transferReasonCode: string;
  /** Transfer-reason description. */
  transferReasonDescription: string;
  /** Gross-weight unit code (e.g. KGM). */
  grossWeightUnit: string;
  /** Gross weight. */
  grossWeight: string;
  /** Total number of packages/bales (optional). */
  totalPackages?: string;
  /** Transport modality code ("01" = public, "02" = private). */
  transportModalityCode: string;
  /** Shipment start date (YYYY-MM-DD). */
  startDate: string;
  /** Vehicle license plate. */
  vehiclePlate?: string;
  /** Destination ubigeo code. */
  destinationUbigeoCode: string;
  /** Destination address. */
  destinationAddress: string;
  /** Origin ubigeo code. */
  originUbigeoCode: string;
  /** Origin address. */
  originAddress: string;
  /** Related document number. */
  relatedDocumentNumber?: string;
  /** Related document type code. */
  relatedDocumentTypeCode?: string;
  /** Related document description. */
  relatedDocumentDescription?: string;
  /** Related issuer-company document type code. */
  relatedCompanyDocumentTypeCode?: string;
  /** Related issuer-company document number. */
  relatedCompanyDocumentNumber?: string;
  /** Voided flag. */
  voidedFlag?: string;
  /** Voided reference document. */
  voidedReferenceDocument?: string;
  /** Voided reference document type code. */
  voidedReferenceDocumentTypeCode?: string;

  // Carrier data (private-sender / carrier guides)
  carrierDocumentType?: string;
  carrierDocumentNumber?: string;
  carrierBusinessName?: string;
  driverDocumentType?: string;
  driverDocumentNumber?: string;
  driverFirstName?: string;
  driverLastNames?: string;
  driverLicense?: string;

  // Carrier-guide-only fields
  senderDocumentNumber?: string;
  senderDocumentType?: string;
  senderBusinessName?: string;
  vehicleMtcRegistrationId?: string;
  trailerPlate?: string;
  trailerMtcRegistrationId?: string;
  companyMtcRegistrationNumber?: string;

  /** Items transported. */
  items: RemittanceGuideItem[];

  /** Allows extra undocumented provider fields without breaking typing. */
  [key: string]: unknown;
}

/** Acceptance/hash block returned by the provider for a guide. */
export interface RemittanceGuideProviderResult {
  /** SUNAT response code ("0" = accepted). */
  sunatCode: string;
  /** SUNAT response message. */
  sunatMessage: string;
  /** CDR hash. */
  cdrHash: string;
  /** Ticket for later status queries. */
  ticket: string;
  /** URL of the generated guide PDF/XML. */
  guideUrl: string;
}

/** Response for guide emission. */
export interface RemittanceGuideResponse {
  /** XML message returned by the provider. */
  xmlMessage: string;
  /** CPE hash. */
  voucherHash: string;
  /** Provider/SUNAT result block. */
  providerResult: RemittanceGuideProviderResult;
}

/* ============================================================
 * Remittance guide ticket status
 * POST /v1/sunat/guia-remision/ticket-status
 * ============================================================ */

/** Payload to query the status of an emitted guide by ticket. */
export interface RemittanceGuideTicketStatusRequest {
  /** Ticket returned by the emission call. */
  ticket: string;
  /** Issuer company RUC. */
  companyDocumentNumber: string;
  /** Issuer SUNAT Sol username. */
  companySolUsername: string;
  /** Issuer SUNAT Sol password. */
  companySolPassword: string;
  /** Provider ID token. */
  idToken: string;
  /** Provider token key. */
  tokenKey: string;
  /** SUNAT document type code. */
  documentTypeCode: string;
  /** Guide serial-number. */
  documentNumber: string;
  /** SUNAT process type. */
  processType: string;
}

/** Status response shape is the same as the emission response. */
export type RemittanceGuideTicketStatusResponse = RemittanceGuideResponse;
