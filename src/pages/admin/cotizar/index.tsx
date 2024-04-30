import React from 'react'
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ADMIN_ROUTES } from 'src/common/consts';
import { QuoteIcon } from 'src/common/icons';
import { IntranetLayout } from 'src/components';
import { CONSTROAD_COLORS } from 'src/styles/shared';

export const QuotesPage = () => {
  const router = useRouter()

  const quoteTabs = [
    {
      name: 'Cotizar Asfalto',
      path: ADMIN_ROUTES.asphaltQuote,
      bgColor: CONSTROAD_COLORS.black,
      textColor: 'white',
      icon: QuoteIcon
    },
    {
      name: 'Cotizar Servicio',
      path: ADMIN_ROUTES.serviceQuote,
      bgColor: CONSTROAD_COLORS.yellow,
      textColor: 'black',
      icon: QuoteIcon
    },
  ]

  return (
    <IntranetLayout>
      <Flex width='100%' justifyContent='center'>
        <Grid templateColumns={{base: "repeat(2, 1fr)", md: 'repeat(2, 1fr)'}} gap="4px" mb="10px" width={{base: '100%', md: '60%'}} mx={{base:'', md: 'auto'}}  >
          {quoteTabs.map((tab) => (
            <Flex
              key={tab.name}
              bgColor={tab.bgColor}
              rounded='8px'
              shadow='md'
              flexDir='column'
              justifyContent='center'
              alignItems='center'
              paddingX={{base: '10px', md: ''}}
              textAlign='center'
              color={tab.textColor}
              height={{ base: '100px', md: '150px' }}
              fontSize={{base: 13, md: 20}}
              fontWeight={600}
              _hover={{ bgColor: tab.bgColor, opacity: 0.8 }}
              cursor='pointer'
              onClick={() => tab.path && router.push(tab.path)}
              gap='10px'
            >
              <Text lineHeight={{ base: '14px', md: '16px' }}>
                {tab.name}
              </Text>
              <Box>
                {<tab.icon fontSize={25} />}
              </Box>
            </Flex>
          ))}
        </Grid>
      </Flex>
    </IntranetLayout>
  )
}

export default QuotesPage;

