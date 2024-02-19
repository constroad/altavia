import { CONSTROAD } from "src/common/consts";
import { PurchaseOrder } from "src/common/types";
import { getDate } from "src/common/utils";
import { CONSTROAD_COLORS } from "src/styles/shared";

export const htmlPurchaseOrder = (clientData: PurchaseOrder, bgImg: any, logoImg: any): string => {
  const { currentYear } = getDate()

  return `
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PDF Orden de Compra Template</title>
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
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
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
          margin-top: 60px;
          display: flex;
          flex-direction: column;
          font-size: 16px;
        }

        .data {
          width: 100%;
          margin-top: 60px;
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
          background-color: transparent;
          border: 0.5px solid ${CONSTROAD_COLORS.bgPDF};
        }
        .table-row {
          width: 100%;
          display: flex;
          font-size: 10px;
          font-weight: bold;
        }
        .table-cell-header {
          border-right: 0.5px solid ${CONSTROAD_COLORS.black};
          background: ${CONSTROAD_COLORS.bgPDF};
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 0 2px;
        }
        .table-cell-body {
          border-right: 0.5px solid ${CONSTROAD_COLORS.bgPDF};
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
          <div style="display: flex; align-items: center; gap: 5px">
            <img src="data:image/jpeg;base64, ${logoImg}" alt="constroad-logo" style="width: 40px; height: 40px; border-radius: 10px;" />
            <div style="font-size: 20px; font-weight: 600;" >ConstRoad</div>
          </div>

          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 14px;">
            <div style="font-weight: 600;">${CONSTROAD.companyName}</div>
            <div style="font-weight: 600">RUC: ${CONSTROAD.ruc}</div>
            <div style="font-size: 11px; margin-top: 5px;">${CONSTROAD.address}</div>
          </div>

          <div style="border-radius: 4px; border: 1.5px solid ${CONSTROAD_COLORS.bgPDF}; min-width: 210px; font-size: 14px;">
            <div style="display: flex; justify-content: center; padding: 5px 0; font-weight: 600;">
              R.U.C.: ${CONSTROAD.ruc}
            </div>
            <div style="background: ${CONSTROAD_COLORS.bgPDF}; padding: 5px 0; font-weight: 600; font-size: 15; color: white; display: flex; justify-content: center;">
              ORDEN DE COMPRA
            </div>
            <div style="display: flex; justify-content: center; padding: 5px 0; font-weight: 600; ">Nro. <span style="color: white; margin-left: 5px">0000000</span></div>
          </div>
        </div>

        <div style="widht: 100%; margin-top: 30px; font-size: 10px; display: flex; justify-content: space-between;">
          <div style="width: 67%; display: flex; flex-direction: column; border: 1px solid ${CONSTROAD_COLORS.bgPDF}">
            <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 100%; text-align: center; padding: 7.5px 0; font-weight: 600; font-size: 8px; border-bottom: 0.5px solid ${CONSTROAD_COLORS.black}">
              DATOS PROVEEDOR
            </div>
            <div style="widht: 100%; display: flex;">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 16%; padding: 7px 5px; text-align: end; font-weight: 600;">
                RUC Nro:
              </div>
              <div style="width: 84%; background-color: #fff; padding: 0 5px; display: flex; align-items: center; text-transform: uppercase"></div>
            </div>
            <div style="width: 100%; display: flex;">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 16%; padding: 7px 5px; text-align: end; font-weight: 600;">
                Razón social:
              </div>
              <div style="width: 84%; background-color: #fff; padding: 0 5px; display: flex; align-items: center; text-transform: uppercase"></div>
            </div>
            <div style="width: 100%; display: flex;">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 16%; padding: 7px 5px; text-align: end; font-weight: 600;">
                Dirección:
              </div>
              <div style="width: 84%; background-color: #fff; padding: 0 5px; display: flex; align-items: center; text-transform: uppercase"></div>
            </div>
          </div>

          <div style="width: 32%; display: flex; flex-direction: column; border: 1px solid ${CONSTROAD_COLORS.bgPDF}">
            <div style="widht: 100%; display: flex; text-align: center">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 35%; padding: 7px 5px; text-align: end; font-weight: 600;">Fecha:</div>
              <div style="width: 65%; background-color: #fff; padding: 0 5px; text-transform: uppercase; display: flex; align-items: center"></div>
            </div>
            <div style="width: 100%; display: flex; text-align: center">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 35%; padding: 7px 5px; text-align: end; font-weight: 600;">Forma Pago:</div>
              <div style="width: 65%; background-color: #fff; padding: 0 5px; text-transform: uppercase; display: flex; align-items: center"></div>
            </div>
            <div style="width: 100%; display: flex; text-align: center">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 35%; padding: 7px 5px; text-align: end; font-weight: 600;">Moneda:</div>
              <div style="width: 65%; background-color: #fff; padding: 0 5px; text-transform: uppercase; display: flex; align-items: center"></div>
            </div>
            <div style="width: 100%; display: flex; text-align: center">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 35%; padding: 7px 5px; text-align: end; font-weight: 600;">Proyecto:</div>
              <div style="width: 65%; background-color: #fff; padding: 0 5px; text-transform: uppercase; display: flex; align-items: center"></div>
            </div>
          </div>
        </div>

        <div class="table">
          <div class="table-row table-header" style="height: 28px; font-size: 8px;">
            <div class="table-cell-header" style="width: 4.5%">ITEM</div>
            <div class="table-cell-header" style="width: 64.5%">DESCRIPCION</div>
            <div class="table-cell-header" style="width: 5%">UNIDAD</div>
            <div class="table-cell-header" style="width: 7%">CANTIDAD</div>
            <div class="table-cell-header" style="width: 6.8%">
              <span>PRECIO</span>
              <span>UNITARIO</span>
            </div>
            <div class="table-cell-header" style="width: 12%; border-right: none;">TOTAL</div>
          </div>

          <div class="table-row" style="height: 20px; background: white; height: 410px;">
            <div class="table-cell-body" style="width: 4.5%;"></div>
            <div class="table-cell-body" style="width: 64.5%;">
            </div>
            <div class="table-cell-body" style="align-items: center; width: 5%">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
            <div class="table-cell-body" style="align-items: center; width: 7%;">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
            <div class="table-cell-body" style="align-items: center; width: 6.8%; flex-direction: column;">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
            <div class="table-cell-body" style="align-items: end; width: 12%; border-right: none;">
              <span style="margin-top: 28px; font-weight: normal"></span>
            </div>
          </div>
        </div>

        <div style="width: 100%; border: 0.5px solid ${CONSTROAD_COLORS.bgPDF}; padding: 5px 0; background: white; margin-top: 1px;">
          <span style="padding-left: 5px; font-size: 9px; text-transform: uppercase; font-weight: 600">
            
          </span>
        </div>

        <div style="width: 100%; border: 0.5px solid ${CONSTROAD_COLORS.bgPDF}; display: flex; margin-top: 1px; background: white; justify-content: space-between; height: 60px;">
          <div style="width: 67%; height: 60px; font-size: 7px; padding: 5px;">
            <span style="width: 100%; text-align: justify;">
              LOS PRODUCTOS COMPRADOS DEBEN CUMPLIR LOS REQUERIMIENTOS DE CALIDAD ESPECIFICADOS. LOS NO CONFORMES SE DEVOLVERAN AL PROVEEDOR CON CARGO A SU CUENTA.
              CUANDO SEA NECESARIO SE REALIZARAN INSPECCIONES DE LOS PRODUCTOS EN LOS LOCALES DEL PROVEEDOR.
              LOS PRECIOS DE LA FACTURACION DEBEN COINDICIR CON LOS PRECIOS DE LA ORDEN DE COMPRA, EN CASO CONTRARIO SE HARA DEVOLUCION DE LA FACTURA.
              FAVOR VERIFICAR ANTES DE FACTURAR. LA FACTURACION SE RECIBE HASTA EL 26 DE CADA MES.
            </span>
          </div>
          <div style="width: 33%; height: 60px; display: flex; flex-direction: column; border-left: 0.5px solid ${CONSTROAD_COLORS.bgPDF};">
            <div style="height: 20px; width: 100%; display: flex; border-bottom: 0.5px solid ${CONSTROAD_COLORS.bgPDF};">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 37%; padding: 0 5px; justify-content: end; font-weight: 600; font-size: 9px; display: flex; align-items: center">
                Subtotal:
              </div>
              <div style="width: 63%; background-color: #fff; padding: 0 5px; text-transform: uppercase; display: flex; align-items: center; font-size: 9px;"></div>
            </div>
            <div style="height: 20px; width: 100%; display: flex; border-bottom: 0.5px solid ${CONSTROAD_COLORS.bgPDF};">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 37%; padding: 0 5px; justify-content: end; font-weight: 600; font-size: 9px; display: flex; align-items: center">
                I.G.V:
              </div>
              <div style="width: 63%; background-color: #fff; padding: 0 5px; text-transform: uppercase; display: flex; align-items: center; font-size: 9px;"></div>
            </div>
            <div style="height: 20px; width: 100%; display: flex; border-bottom: 0.5px solid ${CONSTROAD_COLORS.bgPDF};">
              <div style="background: ${CONSTROAD_COLORS.bgPDF}; color: white; width: 37%; padding: 0 5px; justify-content: end; font-weight: 600; font-size: 9px; display: flex; align-items: center">
                Total:
              </div>
              <div style="width: 63%; background-color: #fff; padding: 0 5px; text-transform: uppercase; display: flex; align-items: center; font-size: 9px;"></div>
            </div>
          </div>
        </div>

        <div style="width: 100%; border: 0.5px solid ${CONSTROAD_COLORS.bgPDF}; display: flex; margin-top: 1px; background: white;">
          <div style="width: 67.5%; height: 90px; display: flex; flex-direction: column;">
            <div style="background: ${CONSTROAD_COLORS.bgPDF}; width: 100%; text-transform: uppercase; font-size: 7px; color: white; text-align: center; padding: 3px 0; font-weight: 600; border-bottom: 0.5px solid ${CONSTROAD_COLORS.black}">
              Cuentas bancarias proveedor
            </div>
            
            <div style="display: flex; width: 100%; font-size: 7px; background: ${CONSTROAD_COLORS.bgPDF}; color: white; padding: 3px 0">
              <div style="width: 25%; text-align: center; font-weight: 600;">BANCO</div>
              <div style="width: 25%; text-align: center; font-weight: 600;">NRO. CUENTA</div>
              <div style="width: 25%; text-align: center; font-weight: 600;">CCI</div>
              <div style="width: 25%; text-align: center; font-weight: 600;">TIPO DE CUENTA</div>
            </div>
          </div>

          <div style="width: 32.5%; height: 90px; border-left: 0.5px solid ${CONSTROAD_COLORS.black};">
            <div style="background: ${CONSTROAD_COLORS.bgPDF}; width: 100%; text-transform: uppercase; font-size: 8px; color: white; font-weight: 600; height: 27px; display: flex; align-items: center; justify-content: center;">
              Observaciones
            </div>
          </div>
        </div>

        <div style="width: 100%; display: flex; justify-content: center; aling-items: center; font-size: 9px; font-weight: 600; margin-top: 120px;">
          <div>
          </div>
          <div style="width: 150px; border-top: 1px solid black; display: flex; flex-direction: column; justify-content: center; align-items-center;">
            <span style="text-align: center; margin-top: 2px;">Aprobado por:</span>
            <span style="text-align: center; margin-top: 2px;">Jose Zeña Zamora</span>
            <span style="text-align: center">Gerente</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p style="font-size: 10px;">Generated by ConstRoad - ${currentYear}</p>
      </div>

    </body>
  </html>
  `;
}

