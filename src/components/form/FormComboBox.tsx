'use client';

import {
  Combobox,
  ConditionalValue,
  Portal,
  Show,
  Spinner,
  useFilter,
  useListCollection,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Field } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

type IOption = {
  value: string;
  label: string;
};
export type FormComboBoxProps = {
  label: string;
  placeholder?: string;
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  loading?: boolean;
  onChange?: (value: string[]) => void;
  isRequired?: boolean;
  error?: string;
  size?: ConditionalValue<'sm' | 'md' | 'lg' | 'xs' | undefined>;
  width?: string;
  controlled?: boolean;
};
export const FormComboBox = (props: FormComboBoxProps) => {
  const {
    options = [],
    value,
    onChange,
    isRequired,
    name,
    label,
    error,
    size,
    width,
  } = props;
  const [localValue, setLocalValue] = useState<string[]>([]);
  const { contains } = useFilter({ sensitivity: 'base' });

  const {
    control,
    formState: { errors },
  } = useFormContext() ?? { formState: {} };

  const { collection, filter, set } = useListCollection<IOption>({
    // initialItems: options,
    initialItems: [],
    filter: contains,
  });

  console.log('localvalue', {localValue, value, options})

  useEffect(() => {
    if (options.length > 0) {
      set(options);
    }
  }, [options]);

  useEffect(() => {
    if (value) {
      setLocalValue([value]);
    }
  }, [value]);

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    const filteredItems = options.filter((item) => {
      const searchLower = details.inputValue.toLowerCase()
      const nameParts = item.label.toLowerCase().split(" ")
      // const emailParts = item.email.toLowerCase().split("@")[0].split(".")

      return (
        item.label.toLowerCase().includes(searchLower)
        // nameParts.some((part) => part.includes(searchLower)) ||
        // emailParts.some((part) => part.includes(searchLower)) ||
        // item.role.toLowerCase().includes(searchLower)
      )
    })
    set(filteredItems)
  }

  if (props.controlled) {
    return (
      <Combobox.Root
        collection={collection}
        // onInputValueChange={(e) => filter(e.inputValue)}
        
        onInputValueChange={handleInputChange}
        value={localValue}
        onValueChange={(e) => {
          // if(!props.controlled) {
            setLocalValue(e.value);
          // }
          // if (e.value.length === 0) {
          //   setLocalValue([]);
          // }
          onChange?.(e.value);
        }}
        width="100%"
        size="xs"
      >
        <Combobox.Label>{props.label}</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input
            placeholder={props.placeholder ?? 'escriba para filtrar'}
          />
          <Combobox.IndicatorGroup>
            <Show when={props.loading}>
              <Spinner size="xs" />
            </Show>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content zIndex={99999}>
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
    );
  }

  const isInvalidField = !!errors[name]?.message || error !== undefined;
  return (
    <Field.Root
      invalid={isInvalidField}
      required={isRequired ?? !!error}
      width={width}
    >
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Combobox.Root
              name={field.name}
              collection={collection}
              onInputValueChange={(e) => filter(e.inputValue)}
              value={field.value ? [field.value] : []}
              onValueChange={(e) => {
                field.onChange(e.value);
              }}
              width="100%"
              size="xs"
            >
              <Combobox.Control>
                <Combobox.Input
                  placeholder={props.placeholder ?? 'escriba para filtrar'}
                />
                <Combobox.IndicatorGroup>
                    <Show when={props.loading}>
                      <Spinner />
                    </Show>
                  <Combobox.ClearTrigger />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>
              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content zIndex={99999}>
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
          );
        }}
      />
      <Field.ErrorText>
        {errors[name]?.message as React.ReactNode}
      </Field.ErrorText>
    </Field.Root>
  );
};
