import React from 'react';
import {
  Input,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control'



interface InputNumberFieldProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

export const InputNumberField = ({
  name,
  label,
  isRequired = false,
}: InputNumberFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message;
  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type="number"
            value={field.value || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : '';
              field.onChange(value);
            }}
          />
        )}
      />
      <FormErrorMessage>{errorMessage as React.ReactNode}</FormErrorMessage>
    </FormControl>
  );
};
