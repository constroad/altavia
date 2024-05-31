import { getDate } from "src/common/utils";

export const htmlDispatchNote = ( logoImg: any ): string => {
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
          margin-right: 30px;
          margin-left: 30px;
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
          margin-top: 40px;
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
          bottom: 15px;
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
      </style>
    </head>

    <body>
      <div class="pdf-container">
        <div class="header" style="display: flex; gap: 10px;">
          <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; align-items: center;">
            <img src="data:image/jpeg;base64, ${logoImg}" alt="constroad-logo" style="width: 43px; height: 43px; border-radius: 10px;" />
            <div class="font-logo" style="margin-top: 8px">ConstRoad</div>
            <div style="font-size: 16px; line-height: 18px; font-weight: 600">Planta de Asfalto</div>
          </div>

          <div class="date-container" style="flex: 1.5; display: flex; flex-direction: column; align-items: center">
            <div style="font-size: 20px; line-height: 20px; font-weight: 900">SERVICIOS DE ASFALTO</div>
            <div style="font-size: 20px; line-height: 20px; font-weight: 900">Y PAVIMENTACION</div>
            <div style="font-size: 12px; margin-top: 5px">&#8226; Venta de asfalto &#8226; Certificado de calidad de PEN</div>
            <div style="font-size: 12px;">&#8226; Ensayo Marshall (ASTM D 6926 - 6927)</div>
            <div style="font-size: 12px;">&#8226; Ensayo Rice (AASHTO T 209 / ASTM D 2041)</div>
            <div style="font-size: 12px;">&#8226; Certificado de calidad del MC-30</div>
            <div style="font-size: 12px;" class="just-font">&#8226; Lavado de mezcla asfáltica en caliente (MAC)</div>
          </div>

          <div class="date-container" style="flex: 1; display: flex; flex-direction: column; height: min-content">
            <div style="display: flex; flex-direction: column; border-radius: 14px; border: 2px solid; height: min-content">
              <div style="font-size: 24px; font-weight: 900; height: 30px; display: flex; align-items: center; justify-content: center; background: lightgray; border-radius: 13px 13px 0 0;">VALE</div>
              <div style="color: red; font-size: 18px; font-weight: 900; height: 30px; border-top: 2px solid black; align-items: center; display: flex; padding-left: 52px;">No.</div>
            </div>

            <div style="margin-top: 32px; font-size: 14px; font-weight: 600; padding-left: 10px">
              Fecha: .....................................
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; margin-top: 50px">
          <div style="display: flex; flex-direction: column; gap: 15px">
            <div style="display: flex; font-weight: 600">
              <div style="width: 120px; font-size: 14px;">Señores</div>
              <div>:...........................................................................................................................................</div>
            </div>
            <div style="display: flex; font-weight: 600">
              <div style="width: 120px; font-size: 14px;">Obra</div>
              <div>:...........................................................................................................................................</div>
            </div>
            <div style="display: flex; font-weight: 600">
              <div style="width: 120px; font-size: 14px;">Tipo de Material</div>
              <div>:...........................................................................................................................................</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px; width: 100%">
            <div style="display: flex; flex-direction: column; font-size: 14px; font-weight: 600; margin-left: 115px; gap: 15px">
              <div style="font-weight: 600; font-size: 16px">................................................ M3</div>
              <div style="font-weight: 600; font-size: 16px">................................................</div>
              <div style="font-weight: 600; font-size: 16px">................................................</div>

              <div style="margin-top: 40px; display: flex; flex-direction: column">
                <div style="font-weight: 600; font-size: 16px">................................................</div>
                <div class="just-font" style="font-weight: 600; font-size: 14px; display: flex; padding-left: 70px">ConstRoad</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; font-size: 14px; font-weight: 600; gap: 15px">
              <div style="display: flex; font-size: 14px;">
                <div style="width: 50px">
                  Placa
                </div>
                <div style="font-weight: 600; font-size: 16px">:..............................................</div>
              </div> 

              <div style="display: flex; font-size: 14px;">
                <div style="width: 50px">
                  Chofer
                </div>
                <div style="font-size: 16px">:..............................................</div>
              </div>     
              
              <div style="display: flex; font-size: 14px;">
                <div style="width: 50px">
                  Hora
                </div>
                <div style="font-size: 16px">:..............................................</div>
              </div>

              <div style="margin-top: 40px; display: flex; flex-direction: column">
                <div style="font-weight: 600">................................................</div>
                <div class="just-font" style="font-weight: 600; font-size: 14px; display: flex; padding-left: 45px">Recibí conforme</div>
              </div>
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

