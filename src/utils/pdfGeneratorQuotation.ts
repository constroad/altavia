import { PDFDocument, StandardFonts } from 'pdf-lib'
import fs from 'fs';
import path from 'path';
import { addZerosAhead, formatPriceNumber, getDate } from 'src/common/utils';
import { PDF_TEMPLATE } from 'src/common/consts';

export const generateQuotationPDF = async (data: any) => {
  const { currentDayName, currentDayMonth, currentYear } = getDate()

  const nroCotizacion = addZerosAhead(+data.nroCotizacion)
  const razonSocial = data.razonSocial.toUpperCase()
  const rucCliente = data.ruc === '' ? '- - -' : data.ruc
  const fecha = `${currentDayName}, ${currentDayMonth} de ${currentYear}`

  const unidad = 'M3'
  const totalCubos = data.nroCubos === '' ? '1' : data.nroCubos
  const precioUnitario = data.precioUnitario === '' ? '480' : data.precioUnitario
  const totalWithoutIgv = +totalCubos * +precioUnitario
  const igv = totalWithoutIgv * 0.18
  const totalPresupuesto = totalWithoutIgv + igv

  // read pdf from public
  const pdfPath = path.join(process.cwd(), PDF_TEMPLATE.cotizacion.path, PDF_TEMPLATE.cotizacion.filename);
  const existingPdfBytes = fs.readFileSync(pdfPath);

  // Cargar el PDF desde el buffer
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  // const ArialFont = await pdfDoc.embedFont(StandardFonts.Courier)

  const pages = pdfDoc.getPages()
  const firstPage = pages[ 0 ]
  const { width, height } = firstPage.getSize()


  // Textos originales
  const totalCubosStr = totalCubos.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const totalWithoutIgvStr = formatPriceNumber(totalWithoutIgv).toString();
  const igvStr = formatPriceNumber(igv).toString();
  const totalPresupuestoStr = formatPriceNumber(totalPresupuesto).toString();

  const textWidth = helveticaFont.widthOfTextAtSize(totalCubosStr, 7)
  const textWidth1 = helveticaFont.widthOfTextAtSize(totalWithoutIgvStr, 7);
  const textWidth2 = helveticaFont.widthOfTextAtSize(igvStr, 7);
  const textWidth3 = helveticaFont.widthOfTextAtSize(totalPresupuestoStr, 7);

  // const pageWidth = page.getWidth();
  const rightMargin1 = 51.5;
  const x = width - textWidth - 146;
  const x1 = width - textWidth1 - rightMargin1;
  const x2 = width - textWidth2 - rightMargin1;
  const x3 = width - textWidth3 - rightMargin1;

  // texts
  firstPage.drawText(razonSocial, { x: 90, y: 686.8, size: 12, font:  helveticaBoldFont})

  firstPage.drawText(`Lima ${currentDayMonth}`, { x: 420, y: 760, size: 14, font: helveticaBoldFont  })
  firstPage.drawText(currentYear, { x: 512, y: 746, size: 14, font: helveticaBoldFont  })

  firstPage.drawText(`${nroCotizacion} - ${currentYear}`, { x: 305, y: 592, size: 10, font: helveticaBoldFont })
  firstPage.drawText(razonSocial, { x: 128, y: 569.6, size: 9, font: helveticaBoldFont })
  firstPage.drawText(rucCliente, { x: 128, y: 555.6, size: 9, font: helveticaBoldFont })
  firstPage.drawText(fecha, { x: 128, y: 533.6, size: 9 })

  firstPage.drawText(unidad, { x: 388, y: 470.8, size: 7 })
  firstPage.drawText(totalCubosStr, { x: x, y: 470.8, size: 7 })
  firstPage.drawText(Number(precioUnitario).toFixed(2).toString(), { x: 469.5, y: 470.8, size: 7 })

  firstPage.drawText(totalWithoutIgvStr, { x: x1, y: 470.8, size: 7 })
  firstPage.drawText(totalWithoutIgvStr, { x: x1, y: 384, size: 7 })
  firstPage.drawText(totalWithoutIgvStr, { x: x1, y: 368.5, size: 7 })
  firstPage.drawText(igvStr, { x: x2, y: 358.5, size: 7 })
  firstPage.drawText(totalPresupuestoStr, { x: x3, y: 348, size: 7 })

  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
