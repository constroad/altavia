import React from 'react'
import { Flex, Input, Text } from '@chakra-ui/react'
import { ProdInfoType } from './new-utils'

interface ProductionInfoProps {
  data: ProdInfoType;
  setter: any;
}

export const ProductionInfo = (props: ProductionInfoProps) => {
  const { data } = props;

  const m3Produced = +(data?.m3Produced.toFixed(1))

  const handleChangeInput = (value: string, key: string) => {
    if (key === 'metrado') {
      const newM3 = +value * data?.thickness
      const newDays = Math.ceil(+(newM3 / 250))
      const newM3Daily = newDays <= 1 ? newM3 : Math.ceil(newM3/newDays)
      props.setter({ ...data, days: newDays, m3Produced: newM3, m3Daily: +newM3Daily, [key]: +value })

    } else if ( key === 'thickness' ) {
      const newM3 = +value * data?.metrado
      const newDays = Math.ceil(+(newM3 / 250))
      const newM3Daily = newDays <= 1 ? newM3 : Math.ceil(newM3/newDays)
      props.setter({ ...data, days: newDays, m3Produced: newM3, m3Daily: newM3Daily,[key]: +value })

    } else if ( key === 'days' ) {
      const newM3Daily = (data?.m3Produced / +value).toFixed(2)
      props.setter({ ...data, m3Daily: +newM3Daily, [key]: +value })

    } else if ( key === 'm3Produced' ) {
      const newDays = Math.ceil((+value / 250))
      const newM3Daily = Math.ceil(+value / newDays)
      const newMetrado = +((+value / data?.thickness).toFixed(1))
      props.setter({ ...data, metrado: newMetrado, days: newDays, m3Daily: +newM3Daily, [key]: +value })

    } else if ( key === 'm3Daily') {
      const newDays = Math.ceil(+(data?.m3Produced / + value))
      props.setter({ ...data, days: newDays, [key]: +value  })
  
    } else {
      props.setter({ ...data, [key]: +value })
    }
  }

  return (
    <Flex w='100%' gap='5px' justifyContent='space-between'>
      <Flex w={{ base: '48%', md: '45%' }} gap='5px' flexDir='column' px='6px'>
        <Flex gap='4px' fontSize={{ base: 10, md: 12 }} alignItems='center'>
          <Text minWidth={{ base: '72px', md: '83px' }} fontWeight={600} >Área (m2):</Text>
          <Input
            minWidth={{ base: '78px', md: '90px' }}
            width={{ base: '78px', md: '90px' }}
            fontSize={{ base: 10, md: 12 }}
            type='number'
            px='5px'
            size='sm'
            rounded='6px'
            h='24px'
            value={data?.metrado === 0 ? '' : data?.metrado}
            onChange={(e) => handleChangeInput(e.target.value, 'metrado')}
          />
        </Flex>
        <Flex gap='4px' fontSize={{ base: 10, md: 12 }} alignItems='center'>
          <Text minWidth={{ base: '72px', md: '83px' }} fontWeight={600} >Espesor (cm):</Text>
          <Input
            minWidth={{ base: '78px', md: '90px' }}
            width={{ base: '78px', md: '90px' }}
            fontSize={{ base: 10, md: 12 }}
            rounded='6px'
            h='24px'
            px='5px'
            size='sm'
            type='number'
            value={data?.thickness}
            onChange={(e) => handleChangeInput(e.target.value, 'thickness')}
          />
        </Flex>
        <Flex gap='4px' fontSize={{ base: 10, md: 12 }} alignItems='center'>
          <Text minWidth={{ base: '72px', md: '83px' }} fontWeight={600} >Desperdicio:</Text>
          <Input
            minWidth={{ base: '78px', md: '90px' }}
            width={{ base: '78px', md: '90px' }}
            fontSize={{ base: 10, md: 12 }}
            px='5px'
            size='sm'
            rounded='6px'
            h='24px'
            value={data?.waste || '0.10'}
            onChange={(e) => handleChangeInput(e.target.value, 'waste')}
            disabled
          />
        </Flex>
      </Flex>
      <Flex w={{ base: '48%', md: '45%' }} gap='5px' flexDir='column' px='8px'>
        <Flex gap='4px' fontSize={{ base: 10, md: 12 }} alignItems='center'>
          <Text minWidth={{ base: '64px', md: '83px' }} fontWeight={600} >M3:</Text>
          <Input
            minWidth={{ base: '78px', md: '90px' }}
            width={{ base: '78px', md: '90px' }}
            fontSize={{ base: 10, md: 12 }}
            px='5px'
            type='number'
            size='sm'
            rounded='6px'
            h='24px'
            value={m3Produced === 0 ? '' : m3Produced}
            onChange={(e) => handleChangeInput(e.target.value, 'm3Produced')}
          />
        </Flex>
        <Flex gap='4px' fontSize={{ base: 10, md: 12 }} alignItems='center'>
          <Text minWidth={{ base: '64px', md: '83px' }} fontWeight={600} >Dias</Text>
          <Input
            minWidth={{ base: '78px', md: '90px' }}
            width={{ base: '78px', md: '90px' }}
            fontSize={{ base: 10, md: 12 }}
            px='5px'
            size='sm'
            rounded='6px'
            type='number'
            h='24px'
            value={data?.days === 0 ? '' : data?.days}
            onChange={(e) => handleChangeInput(e.target.value, 'days')}
          />
        </Flex>
        <Flex gap='4px' fontSize={{ base: 10, md: 12 }} alignItems='center'>
          <Text minWidth={{ base: '64px', md: '83px' }} fontWeight={600} >M3 Diario:</Text>
          <Input
            minWidth={{ base: '78px', md: '90px' }}
            width={{ base: '78px', md: '90px' }}
            fontSize={{ base: 10, md: 12 }}
            type='number'
            px='5px'
            size='sm'
            rounded='6px'
            h='24px'
            value={data?.m3Daily === 0 ? '' : +(data?.m3Daily.toFixed(1))}
            onChange={(e) => handleChangeInput(e.target.value, 'm3Daily')}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ProductionInfo
