import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { buttonRecipe } from "./recipes/button";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          DEFAULT: { value: "{colors.primary.500}" },
          50: { value: "#D1E7DD" },
          100: { value: "#A3CEBA" },
          200: { value: "#75B299" },
          300: { value: "#478678" },
          400: { value: "#14724C" },
          500: { value: "#0F5C3D" },
          600: { value: "#0D4F36" },
          700: { value: "#093D27" },
        },
        danger: {
          DEFAULT: { value: "{colors.danger.500}" },
          50: { value: "#FDEDED" },
          100: { value: "#F8D7DA" },
          200: { value: "#F1AEB5" },
          300: { value: "#EA868F" },
          400: { value: "#E35D6A" },
          500: { value: "#DC3545" },
          600: { value: "#B02A37" },
          700: { value: "#842029" },
        },
        white: { DEFAULT: { value: "#ffffff" } },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          solid: { value: "{colors.primary.500}" },
          contrast: { value: "{colors.white}" },
          focusRing: { value: "{colors.primary.600}" },
          muted: { value: "{colors.primary.50}" },
        },
        danger: {
          solid: { value: "{colors.danger.500}" },
          contrast: { value: "{colors.white}" },
          focusRing: { value: "{colors.danger.600}" },
          muted: { value: "{colors.danger.100}" },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
