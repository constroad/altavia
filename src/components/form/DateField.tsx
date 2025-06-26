import React from 'react';
import { Input, InputProps, Field } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

import { TypographyProps } from '@chakra-ui/system';

interface DateFieldProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  size?: InputProps["size"]; // added prop size
}

const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  isRequired = false,
  size = 'sm',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Field.Root invalid={!!errors[name]} required={isRequired}>
      {label && <Field.Label htmlFor={name}>{label}
      <Field.RequiredIndicator />
      </Field.Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type="date"
            size={size}
            value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ''}
            onChange={(e) => {
              const value = e.target.value ? new Date(e.target.value).toISOString() : '';
              field.onChange(value);
            }}
          />
        )}
      />
      <Field.ErrorText fontSize={size as TypographyProps["fontSize"]}>{errorMessage}</Field.ErrorText>
    </Field.Root>
  );
};

export default DateField;
