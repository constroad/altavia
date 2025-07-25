import { Flex, Text } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface IPageHeader {
  title?: string | undefined;
  actions?: ReactNode;
}

export const PageHeader = (props: IPageHeader) => {
  const { title, actions } = props;
  return (
    <Flex width='100%' justifyContent='space-between' alignItems='center' mb='10px'>
      {title && (
        <Text
          fontSize={{ base: 25, md: 36 }}
          fontWeight={700}
          color='black'
          lineHeight={{ base: '28px', md: '39px' }}
        >
          {title}
        </Text>
      )}

      {actions && (
        actions
      )}
    </Flex>
  )
}
