import htmlToPdf from 'html-pdf';


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

