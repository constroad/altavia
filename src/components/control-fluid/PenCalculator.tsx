import { Flex, Grid, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FormInput } from '../form'
import { formatPriceNumber } from 'src/common/utils'

interface PenCalculatorProps {
  galonsInStock: number;
}

export const PenCalculator = (props: PenCalculatorProps) => {
  const {galonsInStock} = props;

  const [cubes, setCubes] = useState('100')
  const [galonPerCube, setGalonPerCube] = useState('24')

  const totalPen = +cubes * +galonPerCube
  const penToBuy = totalPen - galonsInStock

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

      <Flex gap='5px'>
        <Text>Tenemos:</Text>
        <Text>{formatPriceNumber(+galonsInStock!)} galones</Text>
      </Flex>

      <Flex gap='5px'>
        <Text>Necesitamos:</Text>
        <Text>{formatPriceNumber(+totalPen)} galones</Text>
      </Flex>

      <Flex gap='5px'>
        <Text>Diferencia a comprar:</Text>
        <Text>{formatPriceNumber(+penToBuy)} galones</Text>
      </Flex>

    </Flex>
  )
}
