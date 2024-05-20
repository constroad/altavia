import { Flex, Grid, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FormInput } from '../form'
import { formatPriceNumber } from 'src/common/utils'

interface PenCalculatorProps {
  penInStock: number;
  penToProduce: number;
}

export const PenCalculator = (props: PenCalculatorProps) => {
  const {penInStock, penToProduce} = props;

  const [cubes, setCubes] = useState('100')
  const [galonPerCube, setGalonPerCube] = useState('24')

  const totalPen = +cubes * +galonPerCube
  const penToBuy = totalPen - penToProduce

  return (
    <Flex flexDir='column' gap='10px'>
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
        gap={2}
      >
        <FormInput
          id='calculate-1'
          label='Cantidad de cubos'
          value={cubes}
          onChange={(e) => setCubes(e.target.value)}
        />
        <FormInput
          id='calculate-2'
          label='Galones por cubo'
          value={galonPerCube}
          onChange={(e) => setGalonPerCube(e.target.value)}
        />
      </Grid>

      {/* <Flex gap='5px'>
        <Text>Tenemos en los tanques:</Text>
        <Text>{formatPriceNumber(+penInStock)} galones de PEN</Text>
      </Flex> */}

      <Flex flexDir='column' gap='10px' fontSize={{ base: '12px', md: '14px' }}>
        <Flex gap='5px'>
          <Text fontWeight={600}>Tenemos para producir (glns):</Text>
          <Text>{formatPriceNumber(+penToProduce!)}</Text>
        </Flex>

        <Flex gap='5px'>
          <Text fontWeight={600}>Necesitamos (glns):</Text>
          <Text>{formatPriceNumber(+totalPen)}</Text>
        </Flex>

        <Flex gap='5px'>
          <Text fontWeight={600}>Diferencia a comprar (glns):</Text>
          <Text>{penToBuy < 0 ? 0 : formatPriceNumber(+penToBuy)}</Text>
        </Flex>
      </Flex>


    </Flex>
  )
}
