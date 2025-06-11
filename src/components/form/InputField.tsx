import React from 'react';
import { Field, Input } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

import { InputProps } from '@chakra-ui/input';

interface InputFieldProps extends InputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  isRequired = false,
  placeholder,
  type,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message;
  return (
    <Field.Root invalid={!!errorMessage} required={isRequired}>
      {label && (
        <Field.Label htmlFor={name}>
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            size="sm"
            {...field}
            id={name}
            placeholder={placeholder}
            type={type}
            onChange={(e) => {
              let value: string | number = e.target.value;
              if (type === 'number') {
                value = +value;
              }
              field.onChange(value); // Asegurar que React Hook Form reciba el valor modificado
            }}
          />
        )}
      />
      {isRequired && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  );
};
