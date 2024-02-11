import { useState } from 'react';
import axios from 'axios';
import { createJsHtmlToPdf } from 'src/utils/createPdf';

const htmlSample = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejemplo de HTML para PDF</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 16px;
    }
    .container {
      width: 80%;
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      color: #333;
    }
    p {
      font-size: 16px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Ejemplo de HTML para PDF</h1>
    <p>Este es un ejemplo de HTML con estilos integrados para generar un PDF.</p>
  </div>
</body>
</html>

`

export default function Home() {
  const [pdfError, setPdfError] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-pdf', {
        data: {
          getHtml: true
        }
      }, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);

      // Crear un enlace temporal para descargar el PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'quote.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfError('Error generating PDF');
    } finally {
      setLoading(false);
    }
  };

  const generatePdf2 = async () => {
    setLoading(true);
    try {
      // Llama a la API para obtener el HTML necesario para generar el PDF
      const response = await axios.get('/api/get-html-for-pdf');

      // Genera el PDF en el navegador utilizando el HTML recibido
      const pdfBuffer = await createJsHtmlToPdf(htmlSample);

      // // Crea un Blob a partir del Buffer
      // const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

      // // Crea una URL del Blob para descargar el PDF
      // const pdfUrl = URL.createObjectURL(pdfBlob);

      // // Crea un enlace temporal para descargar el PDF
      // const link = document.createElement('a');
      // link.href = pdfUrl;
      // link.setAttribute('download', 'quote.pdf');
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      // // Limpiar el URL del Blob
      // URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfError('Error generating PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generatePdf2} disabled={loading}>
        {loading ? 'Generating PDF......' : 'Generate and Download PDF:'}
      </button>
      {pdfError && <p>{pdfError}</p>}
    </div>
  );
}
