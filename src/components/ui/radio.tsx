"use client"

import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react"
import * as React from "react"

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  rootRef?: React.Ref<HTMLDivElement>
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (props, ref) => {
    const { children, inputProps, rootRef, ...rest } = props

    return (
      <ChakraRadioGroup.Item ref={rootRef} {...rest}>
        {/* 👇 asegúrate de que ItemHiddenInput soporte el ref correctamente */}
        {/* @ts-ignore */}
        <ChakraRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
        <ChakraRadioGroup.ItemIndicator />
        {children && (
          <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
        )}
      </ChakraRadioGroup.Item>
    )
  }
)

Radio.displayName = "Radio"

export const RadioGroup = ChakraRadioGroup.Root
