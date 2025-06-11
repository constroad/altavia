import React from 'react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control'
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';

interface CheckboxFieldProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  isRequired = false,
}) => {
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
          <Checkbox {...field} id={name}>
            {label}
          </Checkbox>
        )}
      />
      <FormErrorMessage>{errorMessage as React.ReactNode}</FormErrorMessage>
    </FormControl>
  );
};
