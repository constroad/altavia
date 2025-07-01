import React from 'react';

import { useFormContext, Controller } from 'react-hook-form';

import {
  ConditionalValue,
  Field,
  Portal,
  Select,
  Spinner,
  createListCollection,
} from '@chakra-ui/react';

interface SelectFieldProps {
  name: string;
  label?: string;
  value?: string;
  multiple?: boolean;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  isRequired?: boolean;
  error?: string;
  controlled?: boolean;
  size?: ConditionalValue<'sm' | 'md' | 'lg' | 'xs' | undefined>;
  width?: string;
  loading?: boolean;
}

export const SelectField = (props: SelectFieldProps) => {
  const {
    name,
    value,
    label,
    options,
    isRequired = false,
    error,
    size = 'sm',
    width = '100%',
    multiple = false,
    loading = false,
  } = props;

  const {
    control,
    formState: { errors },
  } = useFormContext() ?? { formState: {} };

  const optionCollection = createListCollection({
    items: options,
    // itemToValue: (item) => item.value,
    // itemToString: (item) => item.label,
    // isItemDisabled: () => false,
  });

  if (props.controlled) {
    return (
      <Field.Root required={isRequired ?? !!error} width={width}>
        <Field.Label>
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
        <Select.Root
          width={width}
          size={size}
          name={name}
          multiple={multiple}
          value={value ? [value] : ['']}
          onValueChange={(details: { value: string[] }) => {
            props.onChange?.(details.value[0] ?? '');
          }}
          collection={optionCollection}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={`Selecciona ${label}`} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              {loading && (
                <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />
              )}
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content zIndex={99999}>
                {optionCollection.items.map((item: any) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Field.Root>
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
            <Select.Root
              width={width}
              size={size}
              name={field.name}
              multiple={multiple}
              value={multiple ? field.value : (field.value ? [field.value] : [])}
              onValueChange={(details: { value: string[] }) => {
                if (multiple) {
                  field.onChange(details.value);
                  return;
                }
                field.onChange(details.value[0] ?? '');
              }}
              onInteractOutside={() => field.onBlur()}
              collection={optionCollection}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder={`Selecciona ${label}`} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  {loading && (
                    <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />
                  )}
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content zIndex={99999}>
                    {optionCollection.items.map((framework: any) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          );
        }}
      />
      <Field.ErrorText>
        {errors[name]?.message as React.ReactNode}
      </Field.ErrorText>
    </Field.Root>
  );
};
