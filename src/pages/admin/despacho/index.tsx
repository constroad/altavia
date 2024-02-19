import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { IntranetLayout, TableColumn } from 'src/components'
import TableComponent from 'src/components/Table/Table'
import DispatchForm from 'src/components/form/DispatchForm'

const mockDispatch = [
  {
    date: '16/02/24',
    material: 'MEZCLA ASFÁLTICA',
    plate: 'AGF858',
    invoice: 'EG01-3',
    guide: 'EG07-00001',
    m3: '20000',
    client: 'GLOBO FAST',
    project: 'ICA',
    carrier: 'CHALIN',
    price: '480',
    igv: '3,456.00',
    total: '22,656.00',
    paymentDone: 'SI'
  },
  {
    date: '15/02/24',
    material: 'MEZCLA ASFÁLTICA',
    plate: 'AGF858',
    invoice: 'EG01-3',
    guide: 'EG07-00001',
    m3: '40',
    client: 'GLOBO FAST',
    project: 'ICA',
    carrier: 'CHALIN',
    price: '480',
    igv: '3,456.00',
    total: '22,656.00',
    paymentDone: 'SI'
  },
  {
    date: '14/02/24',
    material: 'MEZCLA ASFÁLTICA',
    plate: 'AGF858',
    invoice: 'EG01-3',
    guide: 'EG07-00001',
    m3: '40',
    client: 'GLOBO FAST',
    project: 'ICA',
    carrier: 'CHALIN',
    price: '480',
    igv: '3,456.00',
    total: '22,656.00',
    paymentDone: 'SI'
  }
]

const DispatchPage = () => {

  const columns: TableColumn[] = [
    { key: 'date', label: 'Fecha', width: '5%' },
    { key: 'material', label: 'Material', width: '10%' },
    { key: 'plate', label: 'Placa', width: '5%' },
    { key: 'invoice', label: 'Factura', width: '5%' },
    { key: 'guide', label: 'Guía', width: '10%' },
    { key: 'm3', label: 'M3', width: '5%' },
    { key: 'client', label: 'Cliente', width: '10' },
    { key: 'project', label: 'Obra', width: '5%' },
    { key: 'carrier', label: 'Transportista', width: '5%' },
    { key: 'price', label: 'Precio', width: '5%' },
    { key: 'igv', label: 'IGV', width: '10%' },
    { key: 'total', label: 'Total a Pagar', width: '10%' },
    { key: 'paymentDone', label: 'Pagos Realizados', width: '5%' },
];

  return (
    <IntranetLayout>
      <Flex
        flexDir='column'
        alignItems={{base: '', md: ''}}
        marginX='auto'
        gap='15px'
      >
        <Text fontSize={{ base: 25, md: 30 }} fontWeight={700} color='black' lineHeight={{ base: '28px', md: '39px' }} marginX='auto' marginTop='10px' textAlign='center'>
          CONTROL DE DESPACHOS
        </Text>
        
        <DispatchForm/>

        <TableComponent data={mockDispatch} columns={columns} />
      </Flex>

    </IntranetLayout>
  )
}

export default DispatchPage
