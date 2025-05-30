import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'semibold',
    borderRadius: 'md',
  },
  variants: {
    variant: { // <-- cambia 'visual' por 'variant'
      solid: {
        bg: 'primary.500',
        color: 'white',
        _hover: {
          bg: 'primary.600',
        },
      },
      unstyled: {
        bg: 'transparent',
        color: 'inherit',
        _hover: { bg: 'transparent' },
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
})
