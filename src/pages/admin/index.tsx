import React from 'react'
import { useRouter } from 'next/router'
import { Flex, Grid } from '@chakra-ui/react'
import { IntranetLayout, adminTabs } from 'src/components'

const AdminPage = () => {
  const router = useRouter()
  return (
    <IntranetLayout>
      <Flex width='100%'>
        <Grid templateColumns={{base: "repeat(2, 1fr)", md: 'repeat(3, 1fr)'}} gap="4px" mb="10px" width={{base: '100%', md: '40%'}} mx={{base:'', md: 'auto'}}  >
          {adminTabs.map((tab) => (
            <Flex
              key={tab.name}
              bgColor={tab.bgColor}
              rounded='8px'
              shadow='md'
              justifyContent='center'
              alignItems='center'
              paddingX={{base: '10px', md: ''}}
              textAlign='center'
              color={tab.textColor}
              height={{ base: '100px', md: '150px' }}
              fontSize={{base: 13, md: 20}}
              lineHeight={{ base: '20px', md: '' }}
              fontWeight={600}
              _hover={{ bgColor: tab.bgColor, opacity: 0.8 }}
              cursor='pointer'
              onClick={() => tab.path && router.push(tab.path)}
            >
              {tab.name}
            </Flex>
          ))}
        </Grid>
      </Flex>
    </IntranetLayout>
  )
}

export default AdminPage
