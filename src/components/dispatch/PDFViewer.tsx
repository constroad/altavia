import React from 'react'

interface PDFViewerProps {
  pdfImage: any;
  pdfName: string
}

export const PDFViewer = (props: PDFViewerProps) => {
  return (
    <object
      data={`data:application/pdf;base64,${props.pdfImage}`}
      type="application/pdf"
      width="100%"
      height="100%"
      id="pdfObject"
    >
      <p className='my-[10px] text-[14px]'>El visor de PDF no es compatible con tu navegador.</p>
      {/* <p>
        Puedes descargar el PDF{" "}
        <a href={`data:application/pdf;base64,${props.pdfImage}`} download={props.pdfName}>
          aquí
        </a>
        .
      </p> */}
    </object>
  )
}
