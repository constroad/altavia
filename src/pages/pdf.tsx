import { useState } from 'react';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import htmlToPdfmake from 'html-to-pdfmake';

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
      //  const pdfContent = htmlToPdfmake(response.data);

      //  console.log('pdfContent:', pdfContent)
       
      // const pdfDocDefinition = {
      //   content: [
      //     { text: response.data }
      //   ]
      //   // content: pdfContent
      // };

      const pdfDocDefinition =    {
        content: [
          {
            text: 'This is a header, using header style',
            style: 'header'
          },
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n',
          {
            text: 'Subheader 1 - using subheader style',
            style: 'subheader'
          },
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
          {
            text: 'Subheader 2 - using subheader style',
            style: 'subheader'
          },
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
          {
            text: 'It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties',
            style: ['quote', 'small']
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true
          },
          subheader: {
            fontSize: 15,
            bold: true
          },
          quote: {
            italics: true
          },
          small: {
            fontSize: 8
          }
        }
        
      }

      const respp = pdfMake.createPdf(pdfDocDefinition).download('quote.pdf');
      // console.log(respp)

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
