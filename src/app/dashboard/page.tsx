'use client';

import React from 'react';
import { Flex } from '@chakra-ui/react';
import { DashboardLayout } from 'src/components';
import { useFetch } from '@/common/hooks/useFetch';
import { API_ROUTES } from '@/common/consts';

export default function Page() {

  //fetching by default main collections
  useFetch(API_ROUTES.clients);
  useFetch(API_ROUTES.vehicles);
  useFetch(API_ROUTES.drivers);

  return (
    <DashboardLayout>
      <Flex
        w="100%"
        justifyContent="center"
        fontSize={30}
        fontWeight={600}
        mt="200px"
      >
        Estas en el dashboard de Altavía Perú
      </Flex>
    </DashboardLayout>
  );
}
