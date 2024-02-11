import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import htmlToPdf from 'html-pdf';
export async function createQuotePdf(data: any): Promise<Uint8Array> {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create()

  // Embed the Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  // Add a blank page to the document
  const page = pdfDoc.addPage()

  // Get the width and height of the page
  const { width, height } = page.getSize()

  // Draw a string of text toward the top of the page
  const fontSize = 30
  page.drawText('Creating PDFs in JavaScript is awesome!', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()
  return pdfBytes;
}

export async function createHtmlToPdf(html: string): Promise<Buffer> {
  // Convierte el HTML en PDF usando html-pdf
  return new Promise((resolve, reject) => {
    htmlToPdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}