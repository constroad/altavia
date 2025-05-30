import { defineConfig } from '@chakra-ui/react'
import { buttonRecipe } from './recipes/button'

export const theme = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          500: { value: '#0F5C3D' },
          600: { value: '#0D4F36' },
        },
      },
    },
    recipes: {
      Button: buttonRecipe,
      IconButton: buttonRecipe, // si quieres que funcione igual
    },
  },
})
