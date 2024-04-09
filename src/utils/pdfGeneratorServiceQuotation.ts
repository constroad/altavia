import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs';
import path from 'path';
import { addZerosAhead, formatPriceNumber, getDate } from 'src/common/utils';
import { PDF_TEMPLATE } from 'src/common/consts';
import { textSrvc, ServiceQuotePDFType, ServiceType, getQuotePrices } from 'src/components';

export const generateServiceQuotationPDF = async (data: ServiceQuotePDFType) => {
  const { currentDayName, currentDayMonth, currentYear } = getDate( data.date ?? null )

  const services = data.services
  const notes = data.notes

  // ----- ** genero arrays de servicios por separad0 ** -----
  const elementsPerPhase: Record<string, ServiceType[]> = {};
  services.forEach(element => {
      let phase = element.phase || 'otros'; 
      phase = phase.toUpperCase(); 
      if (!elementsPerPhase[phase]) {
        elementsPerPhase[phase] = [];
      }
      elementsPerPhase[phase].push(element);
  });

  const groupedElements: ServiceType[][] = [];
  Object.entries(elementsPerPhase).forEach(([phase, element]) => {
      if (phase !== 'OTROS') {
        groupedElements.push(element);
      }
  });

  const elementosUltimoArray = elementsPerPhase[''] || [];
  const elementosOTROS = elementsPerPhase['OTROS'] || [];

  const elementosFinalesUltimoArray = elementosUltimoArray.concat(elementosOTROS);

  if (elementosFinalesUltimoArray.length > 0) {
    groupedElements.push(elementosFinalesUltimoArray);
  }
  // ----- ** fin de fenerador de arrays de servicios por separado ** -----

  const nroCotizacion = addZerosAhead(+data.nroQuote)
  const companyName = data.companyName.toUpperCase()
  const rucCliente = data.ruc === '' ? '- - -' : data.ruc
  const fecha = `${currentDayName}, ${currentDayMonth} de ${currentYear}`

  const { formattedSubtotal, formattedIGV, formattedTotal } = getQuotePrices(services, data.addIGV, true)

  // read pdf from public
  const pdfPath = path.join(process.cwd(), PDF_TEMPLATE.cotizacion_servicio.page1.path, PDF_TEMPLATE.cotizacion_servicio.page1.filename);
  const existingPdfBytes = fs.readFileSync(pdfPath);

  // Cargar el PDF desde el buffer
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pdfBlankPagePath = path.join(process.cwd(), PDF_TEMPLATE.cotizacion_servicio.page2.path, PDF_TEMPLATE.cotizacion_servicio.page2.filename)
  const existingBlankPagePdfBytes = fs.readFileSync(pdfBlankPagePath)
  const pdfBlankPageDoc = await PDFDocument.load(existingBlankPagePdfBytes);

  const copiedPage = await pdfDoc.copyPages(pdfBlankPageDoc, [0]); // Copiar la primera página del documento secundario al documento principal

  pdfDoc.addPage(copiedPage[0]);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pages = pdfDoc.getPages()
  
  const firstPage = pages[ 0 ]
  const secondPage = pages[ 1 ]
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

  const getCurrentTextLines = (index: number, arr: ServiceType[]) => {
    const maxWidth = 330;
    const currentProd = arr[index]
 
    const lines = [];
    let currentLine = '';
    for (let word of currentProd.description.split(' ')) {
      const width = helveticaFont.widthOfTextAtSize(currentLine + ' ' + word, 7);
      if (width <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return { lines }
  }

  const getCurrentNotesLines = (index: number, arr: any[], maxWidth: number) => {
    // const maxWidth = 330;
    const currentProd = arr[index]
 
    const lines = [];
    let currentLine = '';
    for (let word of currentProd.value.split(' ')) {
      const width = helveticaFont.widthOfTextAtSize(currentLine + ' ' + word, 7.5);
      if (width <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return { lines }
  }

  // FIRST PAGE --- HEADER + DATA
  firstPage.drawText(companyName, { x: 85, y: 717.8, size: 9.5, font: helveticaBoldFont})
  
  firstPage.drawText(currentDayMonthStr, { x: xDayMonth, y: 775, size: 14, font: helveticaBoldFont  })
  firstPage.drawText(currentYear, { x: xYear, y: 760, size: 14, font: helveticaBoldFont  })
  
  firstPage.drawText(`${nroCotizacion} - ${currentYear}`, { x: 305, y: 658, size: 10, font: helveticaBoldFont })
  firstPage.drawText(companyName, { x: 128, y: 640.3, size: 8, font: helveticaBoldFont })
  firstPage.drawText(rucCliente, { x: 128, y: 627.8, size: 8, font: helveticaBoldFont })
  firstPage.drawText(fecha, { x: 128, y: 616, size: 8 })
  
  // FIRST PAGE --- TABLE
  let lastServiceCoors = 580
  groupedElements.forEach((elem: ServiceType[], i) => {
    const lineHeight = 7;
    const startX = 62;

    const title = elem[0].phase === 'OTROS' || elem[0].phase === '' ? 'OTROS' : elem[0].phase;
    firstPage.drawText(title!, { x: 82, y: lastServiceCoors, size: 6, font: helveticaBoldFont });
    firstPage.drawText(`${i + 1}`, { x: 62, y: lastServiceCoors, size: 6, font: helveticaBoldFont });

    lastServiceCoors -= 8

    for (let serviceIdx = 0; serviceIdx < elem.length; serviceIdx++) {
      const service = elem[serviceIdx];
      const { lines } = getCurrentTextLines(serviceIdx, elem);
      let startServiceY = lastServiceCoors

      let isFirstLine = true;
      for (let line of lines) {
        const description = isFirstLine ? `- ${line}` : `  ${line}`
        isFirstLine = false;

        firstPage.drawText(description, { x: startX + 20, y: startServiceY, size: 6, font: helveticaFont });
        startServiceY -= lineHeight;
        lastServiceCoors -= lineHeight
      }

      startServiceY += lineHeight;
      if (lines.length === 2) startServiceY += lineHeight;

      const unitStr = service.unit.toString();
      const quantityStr = service.quantity.toString();
      const unitPriceStr = formatPriceNumber(service.unitPrice);
      const totalStr = formatPriceNumber(service.total);

      const unitWidth = helveticaFont.widthOfTextAtSize(unitStr, 6);
      const quantityWidth = helveticaFont.widthOfTextAtSize(quantityStr, 6.5);
      const unitPriceWidth = helveticaFont.widthOfTextAtSize(unitPriceStr, 6.5);
      const totalWidth = helveticaFont.widthOfTextAtSize(totalStr, 6.5);

      const unitX = width - unitWidth - 189;
      const quantityX = width - quantityWidth - 145.6;
      const unitPriceX = width - unitPriceWidth - 105;
      const totalX = width - totalWidth - 51.5;

      firstPage.drawText(`${i + 1}.${serviceIdx + 1}`, { x: startX, y: startServiceY, size: 6.5, font: helveticaBoldFont });
      firstPage.drawText(unitStr, { x: unitX, y: startServiceY + 1, size: 6, font: helveticaFont });
      firstPage.drawText(quantityStr, { x: quantityX, y: startServiceY + 1, size: 6.5, font: helveticaFont });
      firstPage.drawText(unitPriceStr, { x: unitPriceX, y: startServiceY + 1, size: 6.5, font: helveticaFont });
      firstPage.drawText(totalStr, { x: totalX, y: startServiceY + 1, size: 6.5, font: helveticaFont });

      if (serviceIdx + 1 === elem.length) lastServiceCoors -= 4
    }
  });

  firstPage.drawText(formattedSubtotal, { x: subtotalX, y: 359.5, size: 7.5 })
  firstPage.drawText(formattedSubtotal, { x: subtotalX, y: 343.8, size: 7.5 })
  firstPage.drawText(formattedIGV, { x: igvX, y: 334.4, size: 7.5 })
  firstPage.drawText(formattedTotal, { x: totalX, y: 323, size: 7.5 })


  // FIRST PAGE - PAYMENT NOTES
  let FPlastNoteCoords = 200
  const startX = 80

  const titlePaymentNote = `LAS CONDICIONES DE PAGO SON:`
  if (notes && notes?.[0].texts.length > 0) {
    firstPage.drawText(titlePaymentNote!, { x: startX, y: FPlastNoteCoords, size: 9, font: helveticaBoldFont });
  }
  FPlastNoteCoords -= 16

  notes?.[0].texts.forEach((text: textSrvc, i) => {
    const {lines} = getCurrentNotesLines(i, notes?.[0].texts, 330)

    let isFirstLine = true
    for (let line of lines) {
      const textValue = isFirstLine ? `- ${line.toUpperCase()}` : `  ${line.toUpperCase()}`
      isFirstLine = false;

      firstPage.drawText(textValue, { x: startX, y: FPlastNoteCoords, size: 7.5, font: helveticaFont });
      FPlastNoteCoords -= 10;
    }

    FPlastNoteCoords -= 4;
  });


  // SECOND PAGE - CUADRILLA DE TRABAJO
  let SPlastNoteCoords1 = 725
  const SPstartX1 = 55

  const titleNote1 = `CUADRILLA DE TRABAJO`
  if (notes && notes?.[1].texts.length > 0) {
    secondPage.drawText(titleNote1!, { x: SPstartX1, y: SPlastNoteCoords1, size: 9, font: helveticaBoldFont });
  }
  SPlastNoteCoords1 -= 16

  notes?.[1].texts.forEach((text: textSrvc, i) => {
    const {lines} = getCurrentNotesLines(i, notes?.[1].texts, 230)

    let isFirstLine = true
    for (let line of lines) {
      const textValue = isFirstLine ? `- ${line.toUpperCase()}` : `  ${line.toUpperCase()}`
      isFirstLine = false;
      secondPage.drawText(textValue, { x: SPstartX1, y: SPlastNoteCoords1, size: 7.5, font: helveticaFont });
      SPlastNoteCoords1 -= 10;
    }

    SPlastNoteCoords1 -= 4;
  });

  // SECOND PAGE - NOTA
  let SPlastNoteCoords2 = 725
  const SPstartX2 = 55 + 260

  const titleNote2 = `NOTA`
  if (notes && notes?.[2].texts.length > 0) {
    secondPage.drawText(titleNote2!, { x: SPstartX2, y: SPlastNoteCoords2, size: 9, font: helveticaBoldFont });
  }
  SPlastNoteCoords2 -= 16

  notes?.[2].texts.forEach((text: textSrvc, i) => {
    const {lines} = getCurrentNotesLines(i, notes?.[2].texts, 230)

    let isFirstLine = true
    for (let line of lines) {
      const textValue = isFirstLine ? `- ${line.toUpperCase()}` : `  ${line.toUpperCase()}`
      isFirstLine = false;
      secondPage.drawText(textValue, { x: SPstartX2, y: SPlastNoteCoords2, size: 7.5, font: helveticaFont });
      SPlastNoteCoords2 -= 10;
    }

    SPlastNoteCoords2 -= 4;
  });

  // SECOND PAGE - EQUIPOS Y HERRAMIENTAS
  let SPlastNoteCoords3 = 520
  const SPstartX3 = 55

  const titleNote3 = `EQUIPOS Y HERRAMIENTAS`
  if (notes && notes?.[3].texts.length > 0) {
    secondPage.drawText(titleNote3!, { x: SPstartX3, y: SPlastNoteCoords3, size: 9, font: helveticaBoldFont });
  }
  SPlastNoteCoords3 -= 16

  notes?.[3].texts.forEach((text: textSrvc, i) => {
    const {lines} = getCurrentNotesLines(i, notes?.[3].texts, 230)

    let isFirstLine = true
    for (let line of lines) {
      const textValue = isFirstLine ? `- ${line.toUpperCase()}` : `  ${line.toUpperCase()}`
      isFirstLine = false;
      secondPage.drawText(textValue, { x: SPstartX3, y: SPlastNoteCoords3, size: 7.5, font: helveticaFont });
      SPlastNoteCoords3 -= 10;
    }

    SPlastNoteCoords3 -= 4;
  });

  // SECOND PAGE - EQUIPOS Y HERRAMIENTAS
  let SPlastNoteCoords4 = 610
  const SPstartX4 = 55 + 260

  const titleNote4 = `LOS TRABAJOS A REALIZAR CONTEMPLAN`
  if (notes && notes?.[4].texts.length > 0) {
    secondPage.drawText(titleNote4!, { x: SPstartX4, y: SPlastNoteCoords4, size: 9, font: helveticaBoldFont });
  }
  SPlastNoteCoords4 -= 16

  notes?.[4].texts.forEach((text: textSrvc, i) => {
    const {lines} = getCurrentNotesLines(i, notes?.[4].texts, 230)

    let isFirstLine = true
    for (let line of lines) {
      const textValue = isFirstLine ? `- ${line.toUpperCase()}` : `  ${line.toUpperCase()}`
      isFirstLine = false;
      secondPage.drawText(textValue, { x: SPstartX4, y: SPlastNoteCoords4, size: 7.5, font: helveticaFont });
      SPlastNoteCoords4 -= 10;
    }

    SPlastNoteCoords4 -= 4;
  });

  // SECOND PAGE - EQUIPOS Y HERRAMIENTAS
  let SPlastNoteCoords5 = 520
  const SPstartX5 = 55 + 260

  const titleNote5 = `LA PROPUESTA ECONÓMICA INCLUYE`
  if (notes && notes?.[5].texts.length > 0) {
    secondPage.drawText(titleNote5!, { x: SPstartX5, y: SPlastNoteCoords5, size: 9, font: helveticaBoldFont });
  }
  SPlastNoteCoords5 -= 16

  notes?.[5].texts.forEach((text: textSrvc, i) => {
    const {lines} = getCurrentNotesLines(i, notes?.[5].texts, 230)

    let isFirstLine = true
    for (let line of lines) {
      const textValue = isFirstLine ? `- ${line.toUpperCase()}` : `  ${line.toUpperCase()}`
      isFirstLine = false;
      secondPage.drawText(textValue, { x: SPstartX5, y: SPlastNoteCoords5, size: 7.5, font: helveticaFont });
      SPlastNoteCoords5 -= 10;
    }

    SPlastNoteCoords5 -= 4;
  });


  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
