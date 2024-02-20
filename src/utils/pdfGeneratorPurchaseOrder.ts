import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { addZerosAhead, capitalizeText, formatPriceNumber, getDate } from 'src/common/utils';
import { PDF_TEMPLATE } from 'src/common/consts';
import { PurchaseOrder } from 'src/common/types';

export const generatePurchaseOrderPDF = async (data: PurchaseOrder, base64Signature: string) => {
  const { slashDate } = getDate()

  const nroOrder = addZerosAhead(+data.nroOrder)

  const companyName = data.companyName.toUpperCase()
  const ruc = data.ruc
  const address = capitalizeText(data.address)

  const date = slashDate
  const paymenthMethod = data.paymentMethod
  const currency = data.currency
  const proyect = capitalizeText(data.proyect)

  const products = data.products

  const subtotalProducts = data.total
  const igv = +subtotalProducts.replace(/,/g, '') * 0.18
  const totalProducts = +subtotalProducts.replace(/,/g, '') + igv

  const observaciones = data.observations.toUpperCase()
  const attachSignature = data.attachSignature

  // read pdf from public
  const pdfPath = path.join(process.cwd(), PDF_TEMPLATE.ordenCompra.path, PDF_TEMPLATE.ordenCompra.filename);
  const existingPdfBytes = fs.readFileSync(pdfPath);

  // Cargar el PDF desde el buffer
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pages = pdfDoc.getPages()
  const firstPage = pages[ 0 ]
  const { width, height } = firstPage.getSize()


  const nroOrderWidth = helveticaFont.widthOfTextAtSize(nroOrder, 7.5)
  const subtotalWidth = helveticaFont.widthOfTextAtSize(subtotalProducts, 7.5)
  const igvWidth = helveticaFont.widthOfTextAtSize(formatPriceNumber(igv), 7.5)
  const totalWidth = helveticaFont.widthOfTextAtSize(formatPriceNumber(totalProducts), 7.5)

  const rightMargin = 52;
  const nroOrderX = width - nroOrderWidth - 110;
  const subtotalX = width - subtotalWidth - rightMargin;
  const igvX = width - igvWidth - rightMargin;
  const totalX = width - totalWidth - rightMargin;

  // CLIENT DATA
  firstPage.drawText(nroOrder, { x: nroOrderX, y: 745.5, size: 10, font:  helveticaBoldFont})

  firstPage.drawText(companyName, { x: 112, y: 665.5, size: 7, font:  helveticaFont})
  firstPage.drawText(ruc, { x: 112, y: 684.5, size: 7.5, font:  helveticaFont})
  firstPage.drawText(address, { x: 112, y: 647.2, size: 7, font:  helveticaFont})

  firstPage.drawText(date, { x: 447, y: 703.5, size: 7.5, font:  helveticaFont})
  firstPage.drawText(paymenthMethod, { x: 447, y: 684.5, size: 7.5, font:  helveticaFont})
  firstPage.drawText(currency, { x: 447, y: 665.6, size: 7.5, font:  helveticaFont})
  firstPage.drawText(proyect, { x: 447, y: 647, size: 7.5, font:  helveticaFont})

  // PRODUCTS
  products.map((product, i) => {
    const yOffset = 16; // Espacio vertical entre cada conjunto de drawText

    const startX = 59; // Ajustar la posición horizontal para cada conjunto de drawText
    const startY = 595 - i * yOffset; 

    const quantityStr = product.quantity
    const unitPriceStr = formatPriceNumber(+product.unitPrice)
    const subtotalStr = product.subtotal

    const quantityWidth = helveticaFont.widthOfTextAtSize(quantityStr, 7.5)
    const unitPriceWidth = helveticaFont.widthOfTextAtSize(unitPriceStr, 7.5)
    const subtotalWidth = helveticaFont.widthOfTextAtSize(subtotalStr, 7.5)

    const quantityX = width - quantityWidth - 148
    const unitPriceX = width - unitPriceWidth - 112;
    const subtotalX = width - subtotalWidth - 51.5;

    firstPage.drawText(`${i + 1}`, { x: startX, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(product.description, { x: startX + 20, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(product.unit, { x: startX + 337, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(quantityStr, { x: quantityX, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(unitPriceStr, { x: unitPriceX, y: startY, size: 7.5, font: helveticaFont });
    firstPage.drawText(product.subtotal, { x: subtotalX , y: startY, size: 7.5, font: helveticaFont });
  })

  // SUBTOTAL - IGV - TOTAL
  firstPage.drawText(subtotalProducts, { x: subtotalX , y: 268, size: 7.5, font: helveticaFont });
  firstPage.drawText(formatPriceNumber(igv), { x: igvX , y: 253.5, size: 7.5, font: helveticaFont });
  firstPage.drawText(formatPriceNumber(totalProducts), { x: totalX , y: 239, size: 7.5, font: helveticaFont });

  // OBSERVACIONES
  const maxWidth = 155; // Ancho máximo para el texto
  const lineHeight = 5.5; // Altura de línea

  const lines = [];
  let currentLine = '';
  for (let word of observaciones.split(' ')) {
      const width = helveticaFont.widthOfTextAtSize(currentLine + ' ' + word, 5);
      if (width <= maxWidth) {
          currentLine += (currentLine ? ' ' : '') + word;
      } else {
          lines.push(currentLine);
          currentLine = word;
      }
  }
  lines.push(currentLine); // Agregar la última línea

  // Dibujar cada línea
  const startX = 388; // Coordenada x inicial
  let startY = 205; // Coordenada y inicial
  for (let line of lines) {
      firstPage.drawText(line, { x: startX, y: startY, size: 5, font: helveticaFont });
      startY -= lineHeight;
  }

  // ATTACH SIGNATURE
  if (attachSignature) {
    const embeddedImage = await pdfDoc.embedPng(base64Signature);
    const imageWidth = 100;
    const imageHeight = 100;

    firstPage.drawImage(embeddedImage, {
        x: 272,
        y: 60,
        width: imageWidth,
        height: imageHeight,
    });
  }

  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
