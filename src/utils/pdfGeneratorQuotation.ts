import { PDFDocument, StandardFonts } from 'pdf-lib'
import fs from 'fs';
import path from 'path';
import { addZerosAhead, formatPriceNumber, getDate } from 'src/common/utils';
import { PDF_TEMPLATE } from 'src/common/consts';
import { QuotePDFType, getQuotePrices } from 'src/components';

export const generateQuotationPDF = async (data: QuotePDFType) => {
  const { currentDayName, currentDayMonth, currentYear } = getDate( data.date ?? null )

  const products = data.products

  const defaultNote = 'Adelanto 80% y el 20% el día de la producción'
  const customNotes = data.notes ?? ''

  const nroCotizacion = addZerosAhead(+data.nroQuote)
  const companyName = data.companyName.toUpperCase()
  const rucCliente = data.ruc === '' ? '- - -' : data.ruc
  const fecha = `${currentDayName}, ${currentDayMonth} de ${currentYear}`

  const { formattedSubtotal, formattedIGV, formattedTotal } = getQuotePrices(products, data.addIGV, true)

  // read pdf from public
  const pdfPath = path.join(process.cwd(), PDF_TEMPLATE.cotizacion.path, PDF_TEMPLATE.cotizacion.filename);
  const existingPdfBytes = fs.readFileSync(pdfPath);

  // Cargar el PDF desde el buffer
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pages = pdfDoc.getPages()
  const firstPage = pages[ 0 ]
  const { width, height } = firstPage.getSize()

  // Textos originales
  const currentDayMonthStr = `Lima ${currentDayMonth}`
  const yearStr = currentYear

  const subtotalStr = formattedSubtotal;
  const igvStr = formattedIGV;
  const totalStr = formattedTotal;

  // Anchos
  const dayMonthWidth = helveticaBoldFont.widthOfTextAtSize(currentDayMonthStr, 14)
  const yearWidth = helveticaBoldFont.widthOfTextAtSize(yearStr, 14)

  const subtotalWidth = helveticaFont.widthOfTextAtSize(subtotalStr, 7.5)
  const igvWidth = helveticaFont.widthOfTextAtSize(igvStr, 7.5);
  const totalWidth = helveticaFont.widthOfTextAtSize(totalStr, 7.5);

  const rightMargin = 51.5;
  const subtotalX = width - subtotalWidth - rightMargin;
  const igvX = width - igvWidth - rightMargin;
  const totalX = width - totalWidth - rightMargin;

  const xDayMonth = width - dayMonthWidth - 50
  const xYear = width - yearWidth - 50

  // texts
  firstPage.drawText(companyName, { x: 90, y: 716.8, size: 12, font: helveticaBoldFont})

  firstPage.drawText(currentDayMonthStr, { x: xDayMonth, y: 773, size: 14, font: helveticaBoldFont  })
  firstPage.drawText(currentYear, { x: xYear, y: 758, size: 14, font: helveticaBoldFont  })

  firstPage.drawText(`${nroCotizacion} - ${currentYear}`, { x: 305, y: 637, size: 10, font: helveticaBoldFont })
  firstPage.drawText(companyName, { x: 132, y: 614.6, size: 9, font: helveticaBoldFont })
  firstPage.drawText(rucCliente, { x: 132, y: 600.6, size: 9, font: helveticaBoldFont })
  firstPage.drawText(fecha, { x: 132, y: 578.6, size: 9 })

  products.map((product, i) => {
    const yOffset = 12; // Espacio vertical entre cada conjunto de drawText

    const startX = 62; // Ajustar la posición horizontal para cada conjunto de drawText
    const startY = 530 - i * yOffset; 

    const quantityStr = product.quantity.toString()
    const unitPriceStr = formatPriceNumber(product.unitPrice)
    const totalStr = formatPriceNumber(product.total)

    const quantityWidth = helveticaFont.widthOfTextAtSize(quantityStr, 7.5)
    const unitPriceWidth = helveticaFont.widthOfTextAtSize(unitPriceStr, 7.5)
    const totalWidth = helveticaFont.widthOfTextAtSize(totalStr, 7.5)

    const quantityX = width - quantityWidth - 146
    const unitPriceX = width - unitPriceWidth - 106;
    const totalX = width - totalWidth - 51.5;

    firstPage.drawText(`${i + 1}`, { x: startX, y: startY, size: 7.5, font: helveticaBoldFont });
    firstPage.drawText(product.description, { x: startX + 20, y: startY, size: 7.5, font: helveticaBoldFont });
    firstPage.drawText(product.unit, { x: startX + 328, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(quantityStr, { x: quantityX, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(unitPriceStr, { x: unitPriceX, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(totalStr, { x: totalX , y: startY, size: 7.5, font: helveticaFont });
  })

  { customNotes && (
    firstPage.drawText(customNotes, { x: 157, y: 377.5, size: 7.5, font: helveticaBoldFont})
  )}

  { !customNotes && (
    firstPage.drawText(defaultNote, { x: 157, y: 377.5, size: 7.5, font: helveticaBoldFont})
  )}

  firstPage.drawText(formattedSubtotal, { x: subtotalX, y: 355, size: 7.5 })
  firstPage.drawText(formattedSubtotal, { x: subtotalX, y: 339, size: 7.5 })
  firstPage.drawText(formattedIGV, { x: igvX, y: 330, size: 7.5 })
  firstPage.drawText(formattedTotal, { x: totalX, y: 318, size: 7.5 })

  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
