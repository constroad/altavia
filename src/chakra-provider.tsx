'use client'

import { system } from './theme/index';
import { ChakraProvider } from '@chakra-ui/react'

export function ChakraProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
