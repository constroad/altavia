import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
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
        render={({ field }) => <Input size="sm" {...field} id={name} />}
      />
      <FormErrorMessage>{errorMessage as React.ReactNode}</FormErrorMessage>
    </FormControl>
  );
};
