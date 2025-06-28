import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, Portal, Select, SelectRootProps, createListCollection } from '@chakra-ui/react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { useScreenSize } from 'src/common/hooks';

interface SelectFieldProps extends Omit<SelectRootProps, 'name' | 'children' | 'collection'> {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  isRequired?: boolean;
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  isRequired = false,
  placeholder = 'Selecciona una opción',
  ...rest
}) => {
  const { control, formState: { errors } } = useFormContext();
  const frameworks = createListCollection({ items: options });
  const { isMobile } = useScreenSize();

  const rawError = errors[name];
  const errorMessage =
    typeof rawError === "object" &&
    rawError !== null &&
    "message" in rawError &&
    typeof rawError.message === "string"
      ? rawError.message
      : undefined;

  return (
    <Field.Root invalid={!!errors[name]} w='100%'>
      {label && (
        <Field.Label
          htmlFor={name}
          fontWeight={600}
          fontSize={ isMobile ? 12 : 14}
        >
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select.Root
            {...field}
            {...rest}
            id={name}
            name={field.name}
            value={field.value}
            onValueChange={({ value }) => field.onChange(value)}
            onInteractOutside={() => field.onBlur()}
            collection={frameworks}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={placeholder} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>

            <Portal>
              <Select.Positioner>
                <Select.Content zIndex={99999}>
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        )}
      />
      
      {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  );
};
