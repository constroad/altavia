import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

interface RadioButtonFieldProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  isRequired?: boolean;
}

export const RadioButtonField: React.FC<RadioButtonFieldProps> = ({
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
          <RadioGroup {...field} id={name}>
            <Stack direction="row">
              {options.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        )}
      />
      <FormErrorMessage>{errorMessage as React.ReactNode}</FormErrorMessage>
    </FormControl>
  );
};
