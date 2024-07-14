import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

interface TimeFieldProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

const TimeField: React.FC<TimeFieldProps> = ({
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
        render={({ field }) => <Input type="time" {...field} id={name} />}
      />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default TimeField;
