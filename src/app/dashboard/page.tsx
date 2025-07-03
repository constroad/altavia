'use client';

import React from 'react';
import { Flex } from '@chakra-ui/react';
import { DashboardLayout } from 'src/components';

export default function Page() {

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
