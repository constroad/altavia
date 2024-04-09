import { useState } from 'react';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Configura pdfMake con las fuentes necesarias
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Home() {
  const [pdfError, setPdfError] = useState('');
  const [loading, setLoading] = useState(false);

  const purchaseOrderAPI = '/api/get-purchase-order-pdf'
  const quotationAPI = '/api/get-quotation-pdf'
  const customAPI = '/api/get-custom-pdf'

  const generatePDF = async (apiUrl: string) => {
    setLoading(true);
    try {
      const response = await axios.post(apiUrl, {
        data: {
          name: '',
          email: '',
          razonSocial: '',
          nroCotizacion: '109',
          ruc: '',
          nroCubos: '',
          precioUnitario: '',
          message: '',
          phnoe: '',
        }
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
    <div className='flex flex-col gap-[40px] w-[100%] justify-start mt-[30px]'>
      <button onClick={() => generatePDF(quotationAPI)} disabled={loading}>
        {loading ? 'Generating PDF......' : 'Generate and Download Quotation PDF:'}
      </button>
      <button onClick={() => generatePDF(purchaseOrderAPI)} disabled={loading}>
        {loading ? 'Generating PDF......' : 'Generate and Download Purchase Order PDF:'}
      </button>
      <button onClick={() => generatePDF(customAPI)} disabled={loading}>
        {loading ? 'Generating PDF......' : 'Generate and Download Custom PDF:'}
      </button>
      {pdfError && <p>{pdfError}</p>}
    </div>
  );
}
