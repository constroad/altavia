import React from 'react';
import { Field, Input, InputProps } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import { useScreenSize } from 'src/common/hooks';

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
  isInvalid,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { isMobile } = useScreenSize();

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
      w='100%'
    >
      {label && (
        <Field.Label
          htmlFor={name}
          fontWeight={600}
          fontSize={ isMobile ? 12 : 14}
        >
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            w='100%'
            {...field}
            {...rest}
            id={name}
            placeholder={placeholder}
            type={type}
            value={field.value ?? ''}
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
