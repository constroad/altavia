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

  const { collection, filter } = useListCollection({
    initialItems: options,
    filter: contains,
  });

  useEffect(() => {
    if (value) {
      setLocalValue([value]);
    }
  }, [value]);

  if (props.controlled) {
    return (
      <Combobox.Root
        collection={collection}
        onInputValueChange={(e) => filter(e.inputValue)}
        value={localValue}
        onValueChange={(e) => {
          setLocalValue(e.value);
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
          );
        }}
      />
      <Field.ErrorText>
        {errors[name]?.message as React.ReactNode}
      </Field.ErrorText>
    </Field.Root>
  );
};
