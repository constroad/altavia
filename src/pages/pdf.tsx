import { useState } from 'react';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

// Configura pdfMake con las fuentes necesarias
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Home() {
  const [pdfError, setPdfError] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePdf2 = async () => {
    setLoading(true);
    try {
      // Llama a la API para obtener el HTML necesario para generar el PDF
      const response = await axios.get('/api/get-html-for-pdf');

       // Convierte el HTML a una estructura de pdfmake
       const pdfContent = htmlToPdfmake(response.data);

       console.log('pdfContent:', pdfContent)
       
      const pdfDocDefinition = {
        // content: [
        //   { text: sampleHtml }
        // ]
        content: pdfContent
      };

      pdfMake.createPdf(pdfDocDefinition).download('quote.pdf');

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
