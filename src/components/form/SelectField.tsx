import React from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { useScreenSize } from 'src/common/hooks';

import { useFormContext, Controller } from 'react-hook-form';

import {
  ConditionalValue,
  Field,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';

interface SelectFieldProps {
  name: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  isRequired?: boolean;
  error?: string;
  controlled?: boolean;
  size?: ConditionalValue<'sm' | 'md' | 'lg' | 'xs' | undefined>;
  width?: string
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
    width= '100%'
  } = props;

  const {
    control,
    formState: { errors },
  } = useFormContext() ?? { formState: {} };

  const optionCollection = createListCollection({
    items: options,
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
    isItemDisabled: () => false,
  });

  if (props.controlled) {
    return (
      <Field.Root required={isRequired ?? !!error} width="fit-content">
        <Field.Label>
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
        <Select.Root
          width={width}
          size={size}
          name={name}
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
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
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
      width="320px"
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
              size={size}
              name={field.name}
              value={field.value ? [field.value] : []}
              onValueChange={(details: { value: string[] }) => {
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
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
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
