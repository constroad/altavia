import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

interface SelectFieldProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  isRequired?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
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
          <Select {...field} id={name} placeholder={`Select ${label}`}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      />
      <FormErrorMessage>{errorMessage as React.ReactNode}</FormErrorMessage>
    </FormControl>
  );
};
