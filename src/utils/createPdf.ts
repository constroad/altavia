import { jsPDF } from 'jspdf';

export async function createJsHtmlToPdf(html: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Crea un nuevo objeto jsPDF
      const pdf = new jsPDF();
      const body = document.body

      // Agrega el HTML al documento PDF
      pdf.html(html, {
        callback: function (pdf) {
          pdf.save('pdf-jzena')
          // // Genera el PDF como una cadena de datos (Data URI)
          // const pdfDataUri = pdf.output('datauristring');

          // // Convierte la cadena de datos a un buffer de bytes
          // const data = Buffer.from(pdfDataUri.split(',')[1], 'base64');

          // // Resuelve la promesa con el buffer de bytes
          // resolve(data);
        }
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
}