import { getDate } from "src/common/utils";

export const htmlDispatchReport = ( logoImg: any ): string => {
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
          width: calc(100% - 60px);
          height: 100%;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          z-index: 10;
        }

        .header {
          width: 100%;
          margin-top: 20px;
          display: flex;
          gap: 10px
        }

        .date-container {
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
          bottom: 10px;
          left: 0;
          right: 60;
        }

        .font-logo {
          font-family: 'Anek Devanagari', sans-serif;
          font-weight: 600;
          font-size: 28px;
          line-height: 26px;
        }
        .just-font {
          font-family: 'Anek Devanagari', sans-serif;
        }
        .borders {
          border-left: 0.5px solid black;
          border-top: 0.5px solid black;
          font-size: 12px;
          font-weight: 600;
          padding-left: 2px;
        }
      </style>
    </head>

    <body>
      <div class="pdf-container">
        <div class="header">
          <div style="margin-top: 10px">
            <img src="data:image/jpeg;base64, ${logoImg}" alt="constroad-logo" style="width: 43px; height: 43px; border-radius: 10px;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;">
            <div class="font-logo" style="margin-top: 8px">ConstRoad</div>
            <div style="font-size: 16px; line-height: 18px; font-weight: 600">Planta de Asfalto</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; margin-top: 20px; width: 100%">
          <div style="display: flex; align-items: center">
            <div class="borders" style="background: yellow; width: 100px">CLIENTE</div>
            <div class="borders" style="width: 400px; height: 14px; border-right: 0.5px solid black"></div>
          </div>
          <div style="display: flex; align-items: center">
            <div class="borders" style="background: yellow; width: 100px">OBRA</div>
            <div class="borders" style="width: 400px; height: 14px; border-right: 0.5px solid black"></div>
          </div>
          <div style="display: flex; align-items: center">
            <div class="borders" style="background: yellow; width: 100px">FECHA</div>
            <div class="borders" style="width: 400px; height: 14px; border-right: 0.5px solid black"></div>
          </div>
          <div style="display: flex; align-items: center">
            <div class="borders" style="background: yellow; width: 100px; border-bottom: 0.5px solid black">M3</div>
            <div class="borders" style="width: 400px; height: 14px; border-right: 0.5px solid black; border-bottom: 0.5px solid black"></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; margin-top: 20px; width: 100%">
          <div style="border: 0.5px solid black; width: 650px; font-weight: 650; font-size: 13px; text-align: center; background: yellow">DESPACHOS</div>
          <div style="display: flex; border-left: 0.5px solid; border-right: 0.5px solid; border-bottom: 0.5px solid; width: 650px">
            <div style="text-align: center; font-size: 12px; font-weight: 600; width: 130px; background: gray; color: white; border-right: 0.5px solid black">NRO</div>
            <div style="text-align: center; font-size: 12px; font-weight: 600; width: 130px; background: gray; color: white; border-right: 0.5px solid black">CONDUCTOR</div>
            <div style="text-align: center; font-size: 12px; font-weight: 600; width: 130px; background: gray; color: white; border-right: 0.5px solid black">PLACA</div>
            <div style="text-align: center; font-size: 12px; font-weight: 600; width: 130px; background: gray; color: white; border-right: 0.5px solid black">M3</div>
            <div style="text-align: center; font-size: 12px; font-weight: 600; width: 130px; background: gray; color: white">HORA</div>
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

