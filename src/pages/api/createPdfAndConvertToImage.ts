import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs';
import path from 'path';
import { PDF_TEMPLATE } from 'src/common/consts';

export const createPdfAndConvertToImage = async (data: any) => {
  const {nro, date, clientName, proyect, material, amount, plate, transportist, hour, note} = data;

  const pdfPath = path.join(process.cwd(), PDF_TEMPLATE.dispatchNote.path, PDF_TEMPLATE.dispatchNote.filename);
  const existingPdfBytes = fs.readFileSync(pdfPath);
  
  // Cargar el PDF desde el buffer
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embedding fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // Load an image
  const imagePath = path.join(process.cwd(), '/public/signature-dispatch-note.png'); // replace with your image path
  const imageBytes = fs.readFileSync(imagePath);
  const pngImage = await pdfDoc.embedPng(imageBytes);

  // Get dimensions of the image
  const pngDims = pngImage.scale(0.25);

  const red = rgb(1, 0, 0);

  // Función para dividir el texto en líneas
  function splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number) {
    const newText = text.toLowerCase()
    const words = newText.split(' ');
    let lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  const lines = splitTextIntoLines(note, 160, helveticaFont, 9.5);
  let y = 156.5;

  for (let line of lines) {
    firstPage.drawText(line.toLowerCase(), {
      x: 109,
      y,
      size: 9.5,
      font: helveticaFont,
    });
    y -= 9.5 + 15.5; // Ajusta el espacio entre líneas
  }

  // Draw text
  firstPage.drawText(nro, { x: 468, y: 348.5, size: 13, font: helveticaBoldFont, color: red });
  firstPage.drawText(date, { x: 480, y: 310, size: 10, font: helveticaBoldFont });
  firstPage.drawText(clientName.toUpperCase(), { x: 120, y: 260, size: 10, font: helveticaBoldFont });
  firstPage.drawText(proyect.toUpperCase(), { x: 120, y: 235, size: 10, font: helveticaBoldFont });
  firstPage.drawText(material.toUpperCase(), { x: 120, y: 210, size: 10, font: helveticaBoldFont });
  firstPage.drawText(amount.toString(), { x: 188, y: 181, size: 13, font: helveticaBoldFont });
  firstPage.drawText(plate.toUpperCase(), { x: 430, y: 181, size: 10, font: helveticaBoldFont });
  firstPage.drawText(transportist.toUpperCase(), { x: 430, y: 156, size: 10, font: helveticaBoldFont });
  firstPage.drawText(hour.toUpperCase(), { x: 430, y: 131, size: 10, font: helveticaBoldFont });

  // Draw the image
  firstPage.drawImage(pngImage, {
    x: 120,
    y: 23,
    width: pngDims.width,
    height: pngDims.height,
  });

  // Serializar el PDF a bytes
  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes).toString('base64');
};
