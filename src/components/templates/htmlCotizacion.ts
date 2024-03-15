import { CONSTROAD } from "src/common/consts";
import { getDate } from "src/common/utils";

export const htmlCotizacion = ( bgImg: any, logoImg: any): string => {
  const { currentYear } = getDate()

  return `
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PDF Cotizacion Template</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #000;
        }

        .bg {
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          z-index: -1;
        }

        .pdf-container {
          position: absolute;
          margin-right: 60px;
          margin-left: 60px;
          width: calc(100% - 120px);
          height: 100%;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          z-index: 10;
        }

        .header {
          width: 100%;
          margin-top: 65.5px;
          display: flex;
          align-items: center;
          gap: 8px
        }

        .date-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .date {
          width: 100%;
          text-align: end;
          font-weight: bold;
          box-sizing:
          border-box;
          font-size: 18px;
        }

        .cliente {
          width: 100%;
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          font-size: 16px;
        }

        .data {
          width: 100%;
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          font-size: 12px;
          font-weight: bold;
        }

        .table {
          width: 100%;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          border: 1px solid #000;
          background-color: transparent;
        }
        .table-row {
          width: 100%;
          display: flex;
          font-size: 10px;
          font-weight: bold;
        }
        .table-cell-header {
          border: 1px solid #000;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 0 2px;
        }
        .table-cell-body {
          border: 1px solid #000;
          display: flex;
          flex-direction: column;
          font-size: 11px;
          padding: 1px 2px;
        }

        .payment {
          display: flex;
        }

        .footer {
          text-align: end;
          position: absolute;
          font-weight: bold;
          font-size: 12px;
          bottom: 15px;
          left: 0;
          right: 60;
        }
      </style>
    </head>

    <body style="position: relative">

      <div class="bg">
        <img src="data:image/svg+xml;base64, ${bgImg}" alt="background-template" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" />
      </div>

      <div class="pdf-container">
        <div class="header">
          <div style="display: flex; gap: 8px">
            <img src="data:image/jpeg;base64, ${logoImg}" alt="constroad-logo" style="width: 40px; height: 40px; border-radius: 10px;" />
            <div style="font-size: 32px;" >ConstRoad</div>
          </div>
          <div class="date-container">
          </div>
        </div>

        <div class="cliente">
          <div style="display: flex; gap: 5px;">
            <span>Señor:</span>
            <span style="text-transform: uppercase;"></span>
          </div>

          <div style="display: flex; margin-top: 12px;">
            Atención: Mediante la presente, es grato dirigirme a usted para saludarlo y a la vez transcribir nuestra propuesta económica por el servicio solicitado:
          </div>
        </div>

        <div class="data">
          <div style="border: 1px solid #000; background-color: #ffff00; width: 100%; text-align: center; font-size: 14px;">
            COTIZACION No <span style="color: #ffff00; margin-left: 5px">0000000 - 2024</span>
          </div>

          <div style="display: flex; margin-top: 15px; gap: 5px;">
            <span style="width: 100px;">RAZON SOCIAL:</span>
            <span style="text-transform: uppercase;"></span>
          </div>
          <div style="display: flex; margin-top: 5px; gap: 5px;">
            <span style="width: 100px;">RUC:</span>
            <span></span>
          </div>
          <div style="display: flex; margin-top: 15px; gap: 5px">
            <span style="width: 100px;">FECHA:</span>
            <span style="font-weight: normal;">
              
            </span>
          </div>
        </div>

        <div class="table">
          <div class="table-row table-header" style="height: 28px;">
            <div class="table-cell-header" style="width: 5%">ITEM</div>
            <div class="table-cell-header" style="width: 63%">DESCRIPCION</div>
            <div class="table-cell-header" style="width: 5.5%">UNIDAD</div>
            <div class="table-cell-header" style="width: 7.9%">CANTIDAD</div>
            <div class="table-cell-header" style="width: 7.5%">
              <span>PRECIO</span>
              <span>UNITARIO</span>
            </div>
            <div class="table-cell-header" style="width: 10.5%">TOTAL</div>
          </div>

          <div class="table-row" style="height: 235px;">
            <div class="table-cell-body" style="width: 5%;"></div>
            <div class="table-cell-body" style="width: 62.7%;">
              <span style="text-transform: uppercase; font-weight: bold; font-size: 10px; margin-top: 28px;">

              </span>
              <span style="text-transform: uppercase; font-weight: bold; margin-top: 135px;">
                Nota:
              </span>
              <span style="font-weight: normal;">
                Certificado de calidad del PEN, tipo de MAC y ensayo de marshall
              </span>
              <span style="margin-top: 12px; font-weight: normal;">
                Atención con 24h de anticipación
              </span>
              <span style="font-weight: bold;">
                FORMA DE PAGO:
              </span>
            </div>
            <div class="table-cell-body" style="align-items: center; width: 5.8%">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
            <div class="table-cell-body" style="align-items: center; width: 8.3%;">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
            <div class="table-cell-body" style="align-items: center; width: 7.8%; flex-direction: column;">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
            <div class="table-cell-body" style="align-items: end; width: 10.4%;">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
          </div>

          <div style="display: flex; height: 28px; font-size: 10px; width: 100%;">
            <div class="table-cell-body" style="justify-content: space-between; text-transform: uppercase; width: 90%;">
              <span style="font-size: 9.5px; font-weight: 600;">costo directo</span>
              <span style="font-size: 9.5px; font-weight: 600;">gastos generales y utilidades</span>
            </div>
            <div class="table-cell-body" style="justify-content: center; align-items: end; width: 10%;">
              <span style="font-weight: normal"></span>
            </div>
          </div>

          <div style="display: flex; height: 28px; font-size: 10px; width: 100%;">
            <div class="table-cell-body" style="justify-content: space-between; text-transform: uppercase; width: 90%;">
              <span style="font-size: 9.5px; font-weight: 600;">sub total</span>
              <span style="font-size: 9.5px; font-weight: 600;">impuesto general a las ventas</span>
            </div>
            <div class="table-cell-body" style=" justify-content: space-between; align-items: end; width: 10%;">
              <span style="font-weight: normal"></span>
              <span style="font-weight: normal"></span>
            </div>
          </div>

          <div style="display: flex; height: 15px; font-size: 10px; width: 100%;">
            <div class="table-cell-body" style="justify-content: center; width: 90%;">
              <span style="text-transform: uppercase; font-weight: bold;">total presupuesto</span>
            </div>
            <div class="table-cell-body" style="justify-content: center; align-items: end; text-align: end; width: 10%; background-color: #ffc100;">
              <span style="text-align: end;"></span>
            </div>
          </div>
        </div>

        <div class="data" style="width: 90%; margin: 90px auto 0;">
          <div style="border: 1px solid #000; background-color: #ffff00; width: 100%; text-align: center; font-size: 14px;">
            Información de pago
          </div>
          <span style="margin-top: 14px">
            El pago debe ser abonado en una de nuestras cuentas a nombre de:
          </span>
          <div style="display: flex; margin-top: 10px; gap: 5px;">
            <span style="width: 105px;">RAZON SOCIAL:</span>
            <span style="text-transform: uppercase;">${CONSTROAD.companyName}</span>
          </div>
          <div style="display: flex; margin-top: 5px; gap: 5px;">
            <span style="width: 105px;">RUC:</span>
            <span style="text-transform: uppercase;">${CONSTROAD.ruc}</span>
          </div>
          <div style="display: flex; margin-top: 5px; gap: 5px;">
            <span style="width: 105px;">CORREO:</span>
            <span>${CONSTROAD.email}</span> |
            <span>https://${CONSTROAD.web}</span>
          </div>
          <div style="display: flex; margin-top: 5px; gap: 5px;">
            <span style="width: 105px;">TELÉFONO:</span>
            <span style="text-transform: uppercase;">${CONSTROAD.phoneJose}</span> |
            <span style="text-transform: uppercase;">${CONSTROAD.phoneCarin}</span>
          </div>
        </div>

        <div style="width: 90%; margin: 0 auto; margin-top: 12px;">
          <div class="table">
            <div class="table-row table-header" style="height: 20px;">
              <div class="table-cell-header" style="width: 25%">Banco</div>
              <div class="table-cell-header" style="width: 25%">Nro CUENTA</div>
              <div class="table-cell-header" style="width: 25%">CCI</div>
              <div class="table-cell-header" style="width: 25%">TIPO DE CUENTA</div>
            </div>

            <div class="table-row" style="height: 25px;">
              <div class="table-cell-body" style="justify-content: center; width: 25%;">Interbank</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">200-3005742011</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">003-200-003005742011-36</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">Cuenta corriente</div>
            </div>

            <div class="table-row" style="height: 25px;">
              <div class="table-cell-body" style="justify-content: center; width: 25%;">BCP</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">1912467635004</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">00219100246763500454</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">Cuenta corriente</div>
            </div>

            <div class="table-row" style="height: 25px;">
              <div class="table-cell-body" style="justify-content: center; width: 25%;">Banco de la Nación</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">00-091-126443</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">01809100009112644390</div>
              <div class="table-cell-body" style="justify-content: center; align-items: center; width: 25%;">Cuenta de detracción</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p style='font-size: 10px;'>Generated by ConstRoad - ${currentYear}</p>
      </div>

    </body>
  </html>
  `;
}

