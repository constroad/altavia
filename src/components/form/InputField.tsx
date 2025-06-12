import React from 'react';
import { Field, Input, InputProps } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

interface InputFieldProps extends InputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  isInvalid?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  isRequired = false,
  placeholder,
  type,
  isInvalid
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const rawError = errors[name];
  const errorMessage =
    typeof rawError === "object" &&
    rawError !== null &&
    "message" in rawError &&
    typeof rawError.message === "string"
      ? rawError.message
      : undefined;


  return (
    <Field.Root
      invalid={isInvalid ?? !!errorMessage}
      required={isRequired}
    >
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
              field.onChange(value);
            }}
          />
        )}
      />
      {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  );

};
