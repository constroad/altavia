'use client'

import { system } from './theme/index';
import { ChakraProvider } from '@chakra-ui/react'

interface ChakraProviderWrapperProps {
  children: React.ReactNode;
}

export function ChakraProviderWrapper({ children }: ChakraProviderWrapperProps) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
