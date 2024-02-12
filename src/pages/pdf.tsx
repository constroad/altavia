import { useState } from 'react';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Configura pdfMake con las fuentes necesarias
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Home() {
  const [pdfError, setPdfError] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-pdf', {
        data: {/* Aquí coloca los datos que quieres enviar a la API */}
      }, {
        responseType: 'arraybuffer',
      });

      // const data = await generateConstroadPDF()
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

  return (
    <div>
      <button onClick={generatePdf} disabled={loading}>
        {loading ? 'Generating PDF......' : 'Generate and Download PDF:'}
      </button>
      {pdfError && <p>{pdfError}</p>}
    </div>
  );
}
