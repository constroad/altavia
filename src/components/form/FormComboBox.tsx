"use client"

import {
  Combobox,
  Portal,
  Show,
  Spinner,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { useEffect, useState } from "react";

export type FormComboBoxProps = {
  label: string
  placeholder?: string
  name?: string
  options: { value: string; label: string }[];
  value?: string;
  loading?: boolean;
  onChange?: (value: string[]) => void;
}
export const FormComboBox = (props: FormComboBoxProps) => {
  const {options = [], value, onChange} = props
  const [localValue, setLocalValue] = useState<string[]>([])
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: options,
    filter: contains,
  })

  useEffect(() => {
    if (value) {
      setLocalValue([value])
    }    
  }, [value])

  return (
    <Combobox.Root
      collection={collection}      
      onInputValueChange={(e) => filter(e.inputValue)}
      value={localValue}
      onValueChange={(e) => {
        setLocalValue(e.value)
        onChange?.(e.value)
      }}
      width="100%"
      size="xs"
    >
      <Combobox.Label>{props.label}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder={props.placeholder ?? 'escriba para filtrar'} />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content zIndex={99999}>
            <Show when={props.loading}>
              <Spinner />
            </Show>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
