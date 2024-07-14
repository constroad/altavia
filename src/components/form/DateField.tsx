import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

interface DateFieldProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  isRequired = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

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
            type="date"
            value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ''}
            onChange={(e) => {
              const value = e.target.value ? new Date(e.target.value).toISOString() : '';
              field.onChange(value);
            }}
          />
        )}
      />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default DateField;
