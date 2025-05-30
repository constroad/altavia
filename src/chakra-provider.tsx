'use client'

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { theme } from './theme'

const system = createSystem(defaultConfig, theme)

export function ChakraProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
