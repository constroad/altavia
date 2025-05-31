import React from 'react';
import {
  Textarea,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control'

interface TextAreaFieldProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
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
        render={({ field }) => <Textarea {...field} id={name} />}
      />
      <FormErrorMessage>{errorMessage as React.ReactNode}</FormErrorMessage>
    </FormControl>
  );
};
