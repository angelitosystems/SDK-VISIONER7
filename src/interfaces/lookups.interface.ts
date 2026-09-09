/* ============================================================
 * Taxpayer lookup (RUC)
 * GET /sunatv1/consultar-ruc/{ruc}
 * ============================================================ */

/** Ubigeo (Peruvian geographic code) information. */
export interface UbigeoInfo {
  /** Ubigeo code assigned by INEI/RENIEC. */
  code: string;
  /** Department (first-level administrative division). */
  department: string;
  /** Province. */
  province: string;
  /** District. */
  district: string;
}

/** Contact phone numbers registered by the taxpayer. */
export interface ContactInfo {
  phone1: string;
  phone2: string;
  phone3: string;
}

/** Tax registration entry (tributo) for the taxpayer. */
export interface TaxInfo {
  /** Tax code (e.g. ISR for income tax). */
  taxCode: string;
  /** Registration effective date. */
  effectiveDate: string;
  /** Registration date (alta). */
  registrationDate: string;
}

/** Core taxpayer data returned by the RUC lookup. */
export interface TaxpayerData {
  /** Registered business name (razón social). */
  businessName: string;
  /** Full name (used for natural-person taxpayers). */
  personFullName: string;
  primaryEmail: string;
  secondaryEmail: string;
  ubigeo: UbigeoInfo;
  contact: ContactInfo;
  /** Registered tax obligations. */
  taxes: TaxInfo[];
  /** Fiscal address (domicilio fiscal). */
  fiscalAddress: string;
  /** Taxpayer status code (habido/notorio). */
  statusCode: string;
  /** Presence/domicle condition code (habido/desubicado). */
  presenceCode: string;
}

/** Response for the taxpayer (RUC) lookup. */
export interface TaxpayerLookupResponse {
  success: boolean;
  /** The taxpayer payload returned by the provider. */
  taxpayer: TaxpayerData;
}

/* ============================================================
 * Fiscal address and annexed establishments
 * GET /sunatv1/locales-establecimientos/{ruc}/{type}
 * ============================================================ */

/**
 * Query target for establishment lookups.
 * - FISCAL_ADDRESS (1): the taxpayer's registered fiscal address.
 * - ANNEXED_ESTABLISHMENTS (2): additional branches/establishments.
 */
export enum EstablishmentQueryType {
  FISCAL_ADDRESS = 1,
  ANNEXED_ESTABLISHMENTS = 2,
}

/** A physical establishment (local) registered under a RUC. */
export interface Establishment {
  streetTypeCode: string;
  streetType: string;
  streetName: string;
  streetNumber: string;
  kilometer: string;
  block: string;
  lot: string;
  apartmentNumber: string;
  interiorNumber: string;
  zoneTypeCode: string;
  zoneType: string;
  zoneName: string;
  reference: string;
  ubigeoCode: string;
  departmentCode: string;
  provinceCode: string;
  department: string;
  district: string;
  province: string;
  /** Full formatted address. */
  address: string;
  legalRepresentativePresenceCode: string;
  legalRepresentativePresence: string;
  annexDocumentTypeCode: string;
  annexDocumentType: string;
  annexDocumentNumber: string;
  relationshipTypeCode: string;
  relationshipName: string;
  categoryCode: string;
  activityType: string;
  latitude: string | null;
  longitude: string | null;
  geodesicCoordinate: string | null;
  coordinatePrecision: string | null;
  ruc: string;
}

/** Response for the fiscal address / establishments lookup. */
export interface EstablishmentLookupResponse {
  success: boolean;
  /** Returned when querying the fiscal address. */
  fiscalAddress?: Establishment[];
  /** Returned when querying annexed establishments. */
  establishments?: Establishment[];
}

/* ============================================================
 * Natural-person lookup (DNI)
 * GET /sunatv1/consultar-personas/{dni}
 * ============================================================ */

/** Data of a natural person (persona natural) by DNI. */
export interface NaturalPersonData {
  paternalSurname: string;
  maternalSurname: string;
  givenNames: string;
  address: string;
  phone: string;
  ubigeo: UbigeoInfo;
}

/** Response for the DNI lookup. */
export interface NaturalPersonLookupResponse {
  success: boolean;
  /** The person payload returned by the provider. */
  person: NaturalPersonData;
}

/* ============================================================
 * SUNAT exchange rate
 * POST /sunatv1/tipo-cambio
 * ============================================================ */

/** Parameters for the monthly exchange-rate query. */
export interface ExchangeRateRequest {
  /** Four-digit year (e.g. 2025). */
  year: number;
  /** Month as a number between 1 and 12. */
  month: number;
  /**
   * Business token. If omitted, the `businessToken` configured
   * in the module is used.
   */
  token?: string;
}

/** A single exchange-rate entry for a publication date. */
export interface ExchangeRateEntry {
  /** Publication date. */
  publicationDate: string;
  /** Rate value. */
  value: string;
  /** Rate side: "C" = buy, "V" = sell. */
  side: 'C' | 'V';
}

/** Response for the exchange-rate query. */
export interface ExchangeRateResponse {
  success: boolean;
  /** Rate entries, including buy and sell rates. */
  data: ExchangeRateEntry[];
}
