'use client';

import {
  Badge,
  Combobox,
  ConditionalValue,
  Portal,
  Show,
  Spinner,
  Wrap,
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
  value?: string | string[];
  loading?: boolean;
  onChange?: (value: string[]) => void;
  isRequired?: boolean;
  error?: string;
  size?: ConditionalValue<'sm' | 'md' | 'lg' | 'xs' | undefined>;
  width?: string;
  controlled?: boolean;
  multiple?: boolean;
  showOptionSelected?: boolean;
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
    multiple = false,
    showOptionSelected = false,
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

  const optionsMap = Object.fromEntries(options.map((x) => [x.value, x.label]));

  useEffect(() => {
    if (options.length > 0) {
      set(options);
    }
  }, [options]);

  useEffect(() => {
    if (typeof value === 'string') {
      setLocalValue([value]);
    }
    if (Array.isArray(value)) {
      setLocalValue(value);
    }
  }, [value]);

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    const filteredItems = options.filter((item) => {
      const searchLower = details.inputValue.toLowerCase();

      return item.label?.toLowerCase().includes(searchLower);
    });
    set(filteredItems);
  };

  if (props.controlled) {
    return (
      <Combobox.Root
        multiple={multiple}
        collection={collection}
        onInputValueChange={handleInputChange}
        value={localValue}
        onValueChange={(e) => {
          setLocalValue(e.value);
          onChange?.(e.value);
        }}
        width="100%"
        size={size ?? 'xs'}
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
        <Show when={showOptionSelected}>
          <Wrap gap="1">
            {localValue.map((skill) => (
              <Badge key={skill}>{optionsMap[skill]}</Badge>
            ))}
          </Wrap>
        </Show>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content zIndex={99999} className="scrollbar-fino">
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
              multiple={multiple}
              name={field.name}
              collection={collection}
              onInputValueChange={handleInputChange}
              value={multiple ? field.value : field.value ? [field.value] : []}
              onValueChange={(e) => {
                if (multiple) {
                  field.onChange(e.value);
                  return;
                }
                field.onChange(e.value[0] ?? '');
              }}
              width="100%"
              size={size ?? 'xs'}
            >
              <Combobox.Control>
                <Combobox.Input
                  placeholder={props.placeholder ?? 'escriba para filtrar'}
                  // value={multiple ? '' : optionsMap[field.value] ?? ''}
                />
                <Combobox.IndicatorGroup>
                  <Show when={props.loading}>
                    <Spinner />
                  </Show>
                  <Combobox.ClearTrigger />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>
              <Show when={showOptionSelected}>
                <Wrap gap="1">
                  {field?.value?.map?.((skill: string) => (
                    <Badge key={skill}>{optionsMap[skill]}</Badge>
                  ))}
                </Wrap>
              </Show>
              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content zIndex={99999} className="scrollbar-fino">
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
