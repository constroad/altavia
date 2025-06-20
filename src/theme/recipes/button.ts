import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "semibold",
    borderRadius: "md",
  },
  variants: {
    variant: {
      solid: {},
      outline: {},
    },
    colorPalette: {
      primary: {},
      danger: {},
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      colorPalette: "primary" as any,
      css: {
        bg: "primary.solid",
        color: "primary.contrast",
        borderColor: "primary.focusRing",
        _hover: {
          bg: "primary.focusRing",
          borderColor: "primary.700",
        },
      },
    },
    {
      variant: "outline",
      colorPalette: "primary" as any,
      css: {
        bg: "colors.white",
        color: "primary.solid",
        border: "1.5px solid",
        borderColor: "primary.solid",
        _hover: {
          bg: "primary.muted",
        },
      },
    },
    {
      variant: "solid",
      colorPalette: "danger" as any,
      css: {
        bg: "danger.solid",
        color: "danger.contrast",
        _hover: {
          bg: "danger.focusRing",
        },
      },
    },
    {
      variant: "outline",
      colorPalette: "danger" as any,
      css: {
        bg: "colors.white",
        color: "danger.solid",
        border: "1.5px solid",
        borderColor: "danger.solid",
        _hover: {
          bg: "danger.muted",
        },
      },
    },
  ],
  defaultVariants: {
    variant: "solid",
    colorPalette: "primary" as any,
  },
});
