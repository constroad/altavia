import React, { useState } from 'react'
import axios from 'axios'

import { Flex, Text } from '@chakra-ui/react'
import { IntranetLayout, PurchaseOrderForm, initialOrder, toast } from 'src/components'
import { API_ROUTES } from 'src/common/consts'
import { PurchaseOrder } from 'src/common/types'
import { getDate } from 'src/common/utils'

const PurchaseOrderPage = () => {
  const { shortDate } = getDate()
  const [order, setOrder] = useState<PurchaseOrder>(initialOrder)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true)

    const data = order

    try {
      const response = await axios.post( API_ROUTES.generateOrderPDF, { data }, {responseType: 'arraybuffer'} )
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfName = `Orden_de_compra_${order.nroOrder}_${order.companyName}_${shortDate}.pdf`

      const pdfUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', pdfName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setOrder(initialOrder)
      successFunction()
      setIsLoading(false)

    } catch (error) {
      console.error("Error generating PDF:", error);

      setIsLoading(false)
      toast.error('Hubo un error al generar la Orden de compra');
    }
  };

  function successFunction() {
    toast.success('Orden de compra generada con éxito')
  }

  return (
    <IntranetLayout>
       <Flex
        flexDir='column'
        alignItems={{base: '', md: ''}}
        marginX='auto'
        gap='20px'
      >
        <Text fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black' lineHeight={{ base: '28px', md: '39px' }} marginX='auto' marginTop='15px' textAlign='center'>
          Generar orden de compra
        </Text>
        <PurchaseOrderForm
          order={order}
          setter={setOrder}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          session
        />
      </Flex>
    </IntranetLayout>
  )
}

export default PurchaseOrderPage
