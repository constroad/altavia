import React from 'react';

import { useFormContext, Controller } from 'react-hook-form';

import { Field, Portal, Select, createListCollection } from '@chakra-ui/react';

interface SelectFieldProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  isRequired?: boolean;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  isRequired = false,
  error,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const optionCollection = createListCollection({
    items: options,
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
    isItemDisabled: () => false,
  });

  return (
    <Field.Root
      invalid={error !== undefined}
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
          console.log('select field:', { field, optionCollection });
          return (
            <Select.Root
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
      <Field.ErrorText>{error as React.ReactNode}</Field.ErrorText>
    </Field.Root>
  );
};
