import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

interface CustomDividerProps {
  label?: string;
  color?: string;
  marginTop?: string;
  marginBottom?: string;
  marginX?: string;

}

export const CustomDivider = (props: CustomDividerProps) => {
  return (
    <Flex
      width='100%'
      alignItems='center'
      mt={ props.marginTop ?? '0px' }
      mb={ props.marginBottom ?? '0px' }
      mx={ props.marginX ?? '0px' }
    >
      <Flex bg={props.color ?? 'gray.300'} h='1px' flex='1' />

      {props.label && (
        <Text fontSize={{ base: 10, md: 12 }} mx='5px' fontWeight={600}>{props.label}</Text>
      )}

      <Flex bg={props.color ?? 'gray.300'} h='1px' flex='1' />
    </Flex>
  )
}

export default CustomDivider
