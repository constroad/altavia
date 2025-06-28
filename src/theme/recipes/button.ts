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
      info: {},
    },
  },
  compoundVariants: [
    // PRIMARY - verde
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

    // DANGER - rojo
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

    // INFO - azul
    {
      variant: "solid",
      colorPalette: "info" as any,
      css: {
        bg: "info.solid",
        color: "info.contrast",
        borderColor: "info.focusRing",
        _hover: {
          bg: "info.focusRing",
          borderColor: "info.700",
        },
      },
    },
    {
      variant: "outline",
      colorPalette: "info" as any,
      css: {
        bg: "colors.white",
        color: "info.solid",
        border: "1.5px solid",
        borderColor: "info.solid",
        _hover: {
          bg: "info.muted",
        },
      },
    },
  ],
  defaultVariants: {
    variant: "solid",
    colorPalette: "primary" as any,
  },
});
