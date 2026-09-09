# SDK-VISIONER7

SDK de integración para **NestJS + TypeScript** desarrollado para facilitar la comunicación entre aplicaciones NestJS y un **servicio de API de Visioner7 contratado por el desarrollador/cliente**.

El SDK proporciona una capa tipada y organizada para consumir las funcionalidades contratadas del servicio, incluyendo consultas relacionadas con SUNAT, emisión de documentos electrónicos y otras operaciones disponibles según el servicio contratado.

> **Importante:** Este proyecto es una integración de software desarrollada de forma independiente para uso de clientes y/o proyectos que cuentan con acceso autorizado al servicio correspondiente.
> No es un producto oficial de Visioner7, no representa a Visioner7 y no implica afiliación, asociación, patrocinio o respaldo por parte de Visioner7.

**Servicio utilizado:**
[https://visioner7-api.com/](https://visioner7-api.com/?utm_source=chatgpt.com)

---

## Características

El SDK proporciona una interfaz tipada para trabajar con las funcionalidades disponibles en el servicio contratado, entre ellas:

* Consulta de RUC.
* Consulta de información de domicilio fiscal.
* Consulta de establecimientos anexos.
* Consulta de DNI.
* Consulta de tipo de cambio.
* Emisión de Guías de Remisión.
* Consulta de estado/ticket de Guías de Remisión.
* Emisión de Comprobantes de Pago Electrónicos (CPE).
* Generación de facturas al contado.
* Generación de facturas al crédito.
* Manejo centralizado de errores.
* Configuración mediante `forRoot`.
* Configuración mediante `forRootAsync`.
* Interfaces TypeScript para requests y responses.
* Integración con `@nestjs/axios`.

El SDK busca proporcionar una capa de abstracción para que la aplicación no tenga que implementar directamente la comunicación HTTP con el servicio externo.

---

# Instalación

El SDK utiliza `@nestjs/axios` para realizar las peticiones HTTP.

```bash
npm install @angelitosystems/sdk-visioner7
npm install @nestjs/axios axios reflect-metadata rxjs
```

Si el proyecto se utiliza dentro de un monorepo o como código interno, también puede integrarse directamente como una librería privada.

Por ejemplo:

```text
libs/sdk-visioner7/
```

También puede distribuirse mediante un registro privado de paquetes.

---

# Configuración

> **Compatibilidad:** los nombres antiguos `SunatModule`, `SunatService` y `SunatApiException` se mantienen como alias obsoletos (deprecated) para facilitar la migración. Se recomienda usar los nuevos nombres `SDKVisioner7Module`, `SDKVisioner7Service` y `SDKVisioner7ApiException`.

## Opción 1: `forRoot`

Configuración síncrona:

```ts
import { Module } from '@nestjs/common';
import { SDKVisioner7Module } from '@angelitosystems/sdk-visioner7';

@Module({
  imports: [
    SDKVisioner7Module.forRoot({
      baseUrl: 'https://visioner7-api.com/api',
      authToken: process.env.SDK_VISIONER7_AUTH_TOKEN,
      businessToken: process.env.SDK_VISIONER7_BUSINESS_TOKEN,
      timeout: 15000,
    }),
  ],
})
export class AppModule {}
```

### Opciones

| Opción          | Descripción                                           |
| --------------- | ----------------------------------------------------- |
| `baseUrl`       | URL base del servicio contratado                      |
| `authToken`     | Token de autenticación proporcionado para el servicio |
| `businessToken` | Token utilizado por determinadas operaciones          |
| `timeout`       | Tiempo máximo de espera de las solicitudes HTTP       |

El valor de `baseUrl` debe corresponder al entorno y servicio que tenga habilitado el cliente.

---

# Opción 2: `forRootAsync`

Se recomienda utilizar `forRootAsync` cuando las credenciales y configuración provienen de variables de entorno o `ConfigService`.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SDKVisioner7Module } from '@angelitosystems/sdk-visioner7';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SDKVisioner7Module.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        baseUrl: config.get<string>('SDK_VISIONER7_BASE_URL'),
        authToken: config.get<string>('SDK_VISIONER7_AUTH_TOKEN'),
        businessToken: config.get<string>('SDK_VISIONER7_BUSINESS_TOKEN'),
        timeout: 15000,
      }),
    }),
  ],
})
export class AppModule {}
```

El módulo puede registrarse como global para evitar importaciones repetidas en los módulos que utilicen `SDKVisioner7Service`.

---

# Variables de entorno

Ejemplo:

```env
SDK_VISIONER7_BASE_URL=https://visioner7-api.com/api
SDK_VISIONER7_AUTH_TOKEN=your_token_here
SDK_VISIONER7_BUSINESS_TOKEN=your_business_token_here
```

**Nunca almacenes credenciales reales directamente dentro del código fuente.**

Se recomienda utilizar:

* Variables de entorno.
* Secret managers.
* Sistemas seguros de configuración.
* Secretos administrados por el proveedor de infraestructura.

---

# Uso del servicio

Una vez configurado el módulo, puedes inyectar `SDKVisioner7Service` en cualquier servicio de NestJS.

```ts
import { Injectable } from '@nestjs/common';
import { SDKVisioner7Service } from '@angelitosystems/sdk-visioner7';

@Injectable()
export class FacturacionService {
  constructor(
    private readonly sdkVisioner7Service: SDKVisioner7Service,
  ) {}

  async validarCliente(ruc: string) {
    const response = await this.sdkVisioner7Service.consultarRuc(ruc);

    return response.comprobante;
  }
}
```

---

# Métodos disponibles

## 1. Consultar RUC

```ts
sdkVisioner7Service.consultarRuc(
  ruc: string | number,
): Promise<ConsultarRucResponse>
```

Realiza una consulta de RUC mediante el servicio contratado.

```ts
const response = await sdkVisioner7Service.consultarRuc(
  '20611187719',
);

console.log(
  response.comprobante.desRazonSocial,
);
```

La aplicación debe contar con las credenciales y permisos correspondientes para utilizar esta operación.

---

# 2. Consultar domicilio fiscal / establecimientos

```ts
sdkVisioner7Service.consultarLocalesEstablecimientos(
  ruc: string | number,
  tipoConsulta: TipoConsultaLocal | number,
): Promise<LocalesEstablecimientosResponse>
```

Tipos disponibles:

```ts
TipoConsultaLocal.DOMICILIO_FISCAL
```

o:

```ts
1
```

Ejemplo:

```ts
const domicilio =
  await this.sdkVisioner7Service.consultarLocalesEstablecimientos(
    '20611187719',
    TipoConsultaLocal.DOMICILIO_FISCAL,
  );
```

---

# 3. Consultar DNI

```ts
sdkVisioner7Service.consultarDni(
  dni: string | number,
): Promise<ConsultarDniResponse>
```

Ejemplo:

```ts
const persona = await this.sdkVisioner7Service.consultarDni(
  '10292315',
);

console.log(
  persona.comprobante.nomPerNat,
);
```

El uso de información personal debe realizarse de acuerdo con la normativa aplicable y con una finalidad legítima.

---

# 4. Tipo de cambio

```ts
sdkVisioner7Service.obtenerTipoCambio(
  params: TipoCambioRequest,
): Promise<TipoCambioResponse>
```

Ejemplo:

```ts
const response =
  await this.sdkVisioner7Service.obtenerTipoCambio({
    anio: 2025,
    mes: 7,
  });

const compra = response.data.find(
  item => item.codTipo === 'C',
)?.valTipo;

const venta = response.data.find(
  item => item.codTipo === 'V',
)?.valTipo;

console.log({
  compra,
  venta,
});
```

Cuando corresponda, el SDK puede utilizar el `businessToken` configurado en el módulo.

---

# 5. Emisión de Guías de Remisión

```ts
sdkVisioner7Service.emitirGuiaRemision(
  payload: GuiaRemisionRequest,
): Promise<GuiaRemisionResponse>
```

También se proporcionan métodos semánticos para facilitar la lectura del código:

```ts
sdkVisioner7Service.emitirGuiaRemisionRemitentePublico(
  payload,
);

sdkVisioner7Service.emitirGuiaRemisionRemitentePrivado(
  payload,
);

sdkVisioner7Service.emitirGuiaRemisionTransportista(
  payload,
);
```

Estos métodos funcionan como una capa de conveniencia sobre las operaciones de emisión disponibles en el servicio.

Los campos requeridos dependerán del tipo de guía y de las especificaciones del servicio contratado.

Ejemplo conceptual:

```ts
const resultado =
  await this.sdkVisioner7Service.emitirGuiaRemision({
    TIPO_PROCESO: '1',
    NRO_DOCUMENTO_EMPRESA: 'YOUR_RUC',
    USUARIO_SOL_EMPRESA: 'YOUR_SOL_USER',
    PASS_SOL_EMPRESA: 'YOUR_SOL_PASSWORD',
    PAS_FIRMA: 'YOUR_SIGNATURE_PASSWORD',

    COD_TIPO_DOCUMENTO: '09',
    NRO_COMPROBANTE: 'T001-00000002',

    FECHA_DOCUMENTO: '2025-08-10',

    RAZON_SOCIAL_EMPRESA:
      'EMPRESA DE EJEMPLO S.A.C.',

    detalle: [
      {
        ITEM: '1',
        UNIDAD_MEDIDA: 'NIU',
        CANTIDAD: '1',
        ORDER_ITEM: '1',
        DESCRIPCION: 'PRODUCTO DE EJEMPLO',
        CODIGO: 'PROD001',
      },
    ],
  });
```

> Los valores mostrados son únicamente ilustrativos. Sustituye las credenciales y datos empresariales por valores correspondientes a tu propio entorno.

---

# 6. Consultar ticket de Guía de Remisión

```ts
sdkVisioner7Service.consultarTicketGuiaRemision(
  payload: GuiaRemisionTicketStatusRequest,
): Promise<GuiaRemisionTicketStatusResponse>
```

Ejemplo:

```ts
const estado =
  await this.sdkVisioner7Service.consultarTicketGuiaRemision({
    TICKET: 'YOUR_TICKET',
    NRO_DOCUMENTO_EMPRESA: 'YOUR_RUC',
    USUARIO_SOL_EMPRESA: 'YOUR_SOL_USER',
    PASS_SOL_EMPRESA: 'YOUR_SOL_PASSWORD',
    ID_TOKEN: 'YOUR_ID_TOKEN',
    CLAVE_TOKEN: 'YOUR_TOKEN_KEY',
    COD_TIPO_DOCUMENTO: '31',
    NRO_COMPROBANTE: 'V001-00000001',
    TIPO_PROCESO: '1',
  });
```

---

# 7. Generación de CPE

```ts
sdkVisioner7Service.generarCpe(
  payload: GenerarCpeRequest,
): Promise<GenerarCpeResponse>
```

También existen métodos de conveniencia:

```ts
sdkVisioner7Service.generarFacturaContado(
  payload,
);

sdkVisioner7Service.generarFacturaCredito(
  payload,
);
```

La modalidad de pago se determina mediante la información enviada en `detalle_forma_pago`.

Ejemplo:

```ts
const factura =
  await this.sdkVisioner7Service.generarCpe({
    txtTIPO_OPERACION: '0101',
    txtTOTAL_GRAVADAS: '305.08',
    txtTOTAL_INAFECTA: '0.00',
    txtTOTAL_EXONERADAS: '0.00',
    txtTOTAL_GRATUITAS: '0.00',
    txtSUB_TOTAL: '305.08',
    txtTOTAL_DESCUENTO: '0.00',
    txtPOR_IGV: '18.00',
    txtTOTAL_IGV: '54.92',
    txtTOTAL: '360.00',

    txtCOD_TIPO_DOCUMENTO: '01',
    txtCOD_MONEDA: 'PEN',

    txtNRO_COMPROBANTE: 'F001-00000001',

    txtNRO_DOCUMENTO_CLIENTE: 'YOUR_CLIENT_DOCUMENT',
    txtRAZON_SOCIAL_CLIENTE:
      'CLIENTE DE EJEMPLO',

    txtNRO_DOCUMENTO_EMPRESA:
      'YOUR_RUC',

    txtRAZON_SOCIAL_EMPRESA:
      'EMPRESA DE EJEMPLO S.A.C.',

    detalle_forma_pago: [
      {
        COD_FORMA_PAGO: 'Contado',
        MONTO_FORMA_PAGO: '360.00',
      },
    ],

    detalle: [
      {
        txtITEM: '1',
        txtUNIDAD_MEDIDA_DET: 'NIU',
        txtCANTIDAD_DET: '1.00',
        txtPRECIO_DET: '360.00',
        txtIMPORTE_DET: '305.08',
        txtPRECIO_TIPO_CODIGO: '01',
        txtIGV: '54.92',
        POR_IGV: '18.00',
        txtISC: '0.00',
        txtCOD_TIPO_OPERACION: '10',
        txtCODIGO_DET: 'PROD001',
        txtDESCRIPCION_DET:
          'PRODUCTO DE EJEMPLO',
        txtPRECIO_SIN_IGV_DET: '305.08',
        FLG_ICBPER: 0,
        IMPUESTO_BP: '0.00',
        IMPORTE_BP: '0.00',
      },
    ],
  });

console.log(factura.msj_sunat);
console.log(factura.archivo);
```

---

# Manejo de errores

El SDK centraliza los errores mediante `SDKVisioner7ApiException`, que extiende `HttpException` de NestJS.

Ejemplo:

```ts
import { SDKVisioner7ApiException } from
  '@angelitosystems/sdk-visioner7';

try {
  await this.sdkVisioner7Service.consultarRuc(
    '00000000000',
  );
} catch (error) {
  if (error instanceof SDKVisioner7ApiException) {
    console.error(
      error.endpoint,
      error.providerResponse,
    );
  }

  throw error;
}
```

Esto permite integrar fácilmente el SDK con los `ExceptionFilter` globales de NestJS.

---

# Integración recomendada

Una arquitectura recomendada sería:

```text
Frontend
   │
   ▼
Backend / API
   │
   ├── Clientes
   ├── Facturación
   ├── Guías
   ├── Reportes
   │
   ▼
SDKVisioner7Service
   │
   ▼
Servicio API contratado
   │
   ▼
Operaciones correspondientes
```

El frontend **no debe comunicarse directamente con el servicio externo utilizando credenciales privadas**.

Las credenciales deben permanecer exclusivamente en el backend.

---

# Seguridad

Nunca expongas en frontend, JavaScript del navegador, aplicaciones móviles sin protección o repositorios públicos:

```text
SDK_VISIONER7_AUTH_TOKEN
SDK_VISIONER7_BUSINESS_TOKEN
USUARIO_SOL_EMPRESA
PASS_SOL_EMPRESA
PAS_FIRMA
CLAVE_TOKEN
ID_TOKEN
```

Utiliza variables de entorno:

```env
SDK_VISIONER7_AUTH_TOKEN=********
SDK_VISIONER7_BUSINESS_TOKEN=********
```

Y agrega `.env` al `.gitignore`:

```gitignore
.env
.env.local
.env.production
```

---

# Protección de datos

Las operaciones de consulta y emisión pueden involucrar información empresarial o datos personales.

La aplicación que utilice este SDK es responsable de:

* Gestionar adecuadamente las credenciales.
* Implementar controles de acceso.
* Proteger la información almacenada.
* Evitar registrar información sensible innecesariamente.
* Cumplir con la normativa que resulte aplicable.
* Utilizar las credenciales únicamente para las finalidades autorizadas.
* Implementar medidas adecuadas de seguridad.

El SDK no pretende sustituir las obligaciones legales, regulatorias o contractuales del sistema que lo utilice.

---

# Ejemplo de integración completa

La carpeta:

```text
example/
```

puede contener una integración de referencia:

```text
example/
├── app.module.ts
└── app.controller.ts
```

Por ejemplo:

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SDKVisioner7Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        baseUrl: config.get<string>(
          'SDK_VISIONER7_BASE_URL',
        ),

        authToken: config.get<string>(
          'SDK_VISIONER7_AUTH_TOKEN',
        ),

        businessToken: config.get<string>(
          'SDK_VISIONER7_BUSINESS_TOKEN',
        ),

        timeout: 15000,
      }),
    }),
  ],
})
export class AppModule {}
```

---

# Build

Instala las dependencias:

```bash
npm install
```

Compila el proyecto:

```bash
npm run build
```

El resultado normalmente se genera en:

```text
dist/
```

con los archivos JavaScript y declaraciones TypeScript correspondientes.

---

# Estructura del proyecto

```text
@angelitosystems/sdk-visioner7/
│
├── src/
│   ├── interfaces/
│   │   ├── sdk-visioner7-config.interface.ts
│   │   ├── consultas.interface.ts
│   │   ├── guia-remision.interface.ts
│   │   ├── cpe.interface.ts
│   │   └── index.ts
│   │
│   ├── exceptions/
│   │   └── sdk-visioner7-api.exception.ts
│   │
│   ├── constants.ts
│   ├── sdk-visioner7.module.ts
│   ├── sdk-visioner7.service.ts
│   └── index.ts
│
├── example/
│   ├── app.module.ts
│   └── app.controller.ts
│
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

# Naturaleza del proyecto

Este proyecto debe considerarse una **librería de integración independiente**.

La implementación del SDK:

* No constituye una API propia de SUNAT.
* No constituye un producto oficial de Visioner7.
* No representa a Visioner7.
* No afirma una relación societaria, comercial o de representación con Visioner7.
* No modifica ni redistribuye la infraestructura del proveedor.
* Se limita a proporcionar una interfaz de software para facilitar la integración de una aplicación con un servicio externo al que el usuario/cliente tenga acceso autorizado.

La disponibilidad, características, límites, autenticación, endpoints y condiciones de uso del servicio externo dependen del proveedor y del servicio contratado.

---

# Servicio externo

La integración está diseñada para trabajar con el servicio correspondiente disponible en:

[visioner7-api.com](https://visioner7-api.com/?utm_source=chatgpt.com)

Para conocer las condiciones, disponibilidad y características actuales del servicio, consulta directamente la información proporcionada por el proveedor.

---

# Responsabilidad del usuario de la librería

El desarrollador o empresa que utilice este SDK es responsable de:

1. Contar con acceso legítimo al servicio externo.
2. Mantener vigentes sus credenciales.
3. Cumplir las condiciones de uso del servicio contratado.
4. Utilizar las funcionalidades de acuerdo con las autorizaciones correspondientes.
5. Proteger las credenciales de acceso.
6. Cumplir las obligaciones tributarias, comerciales, de privacidad y seguridad que correspondan.
7. Validar que los documentos generados cumplan con los requisitos aplicables a su operación.

---

# Descargo de responsabilidad

Este SDK se proporciona como una herramienta de integración de software.

El desarrollador de esta librería no garantiza la disponibilidad permanente, exactitud, continuidad, tiempos de respuesta o modificaciones futuras del servicio externo.

Los cambios realizados por el proveedor del servicio, incluyendo modificaciones de endpoints, autenticación, formatos de respuesta, límites, requisitos o funcionalidades, pueden requerir actualizaciones del SDK.

La utilización de este SDK no sustituye la revisión de la documentación, condiciones contractuales o requisitos técnicos del servicio externo.

---

# Licencia

La licencia de este proyecto debe definirse de acuerdo con la forma en que se distribuya la librería.

Si se trata de una herramienta privada para proyectos propios o de clientes, se recomienda mantener el repositorio privado y establecer mediante contrato las condiciones de uso, distribución y soporte.

---

## Nota final

Este SDK fue desarrollado como una **capa de integración para facilitar el consumo de un servicio externo contratado**, manteniendo tipado, organización y manejo de errores dentro de aplicaciones NestJS.

Para información sobre el servicio externo utilizado por la integración:

[https://visioner7-api.com/](https://visioner7-api.com/?utm_source=chatgpt.com)