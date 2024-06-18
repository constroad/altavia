import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { PDF_TEMPLATE } from 'src/common/consts';

export const generateDispatchReport = async (data: any) => {

  const client = data.client
  const proyect = data.proyect
  const date = data.date
  const total = data.total.toString()
  const dispatchs = data.dispatchs
  
  // read pdf from public
  const pdfPath = path.join(process.cwd(), PDF_TEMPLATE.dispatchReport.path, PDF_TEMPLATE.dispatchReport.filename);
  const existingPdfBytes = fs.readFileSync(pdfPath);

  // Cargar el PDF desde el buffer
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pages = pdfDoc.getPages()
  const firstPage = pages[ 0 ]
  const { width, height } = firstPage.getSize()

  // CLIENT DATA
  firstPage.drawText(client.toUpperCase(), { x: 125, y: 340, size: 9, font:  helveticaFont})
  firstPage.drawText(proyect.toUpperCase(), { x: 125, y: 328.5, size: 9, font:  helveticaFont})
  firstPage.drawText(date.toUpperCase(), { x: 125, y: 317, size: 9, font:  helveticaFont})
  firstPage.drawText(total.toUpperCase(), { x: 125, y: 305.5, size: 9, font:  helveticaFont})

  // DISPATCHS
  dispatchs.map((dispatch: any, i: number) => {
    const yOffset = 12; // Espacio vertical entre cada conjunto de drawText

    const startX = 65; // Ajustar la posición horizontal para cada conjunto de drawText
    const startY = 253 - i * yOffset; 

    firstPage.drawText(`${i + 1}`, { x: startX + 20, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(dispatch.driverName.toUpperCase(), { x: startX + 85, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(dispatch.driverCard.toUpperCase(), { x: startX + 209.5 , y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(dispatch.quantity.toString(), { x: startX + 318, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(dispatch.hour.toUpperCase(), { x: startX + 405, y: startY, size: 7.5, font: helveticaFont });
  })

  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
