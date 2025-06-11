import { defineConfig } from '@chakra-ui/react'
import { buttonRecipe } from './recipes/button'

export const theme = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          DEFAULT: { value: '#0F5C3D' }, // base
          400: { value: '#14724C' }, // lightPrimary (más claro)
          500: { value: '#0F5C3D' }, // base
          600: { value: '#0D4F36' },
          700: { value: '#093D27' }, // darkPrimary
        },
        black: {
          DEFAULT: { value: '#000000' },
        },
        white: {
          DEFAULT: { value: '#ffffff' },
        },
        text: {
          color: { value: '#707070' },
        },
      },
    },
    recipes: {
      Button: buttonRecipe,
      IconButton: buttonRecipe,
    },
  },
})
