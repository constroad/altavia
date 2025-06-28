import React from 'react';
import { Field, Input, InputProps } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import { useScreenSize } from 'src/common/hooks';

interface InputFieldProps extends Omit<InputProps, 'onChange' | 'value'> {
  name: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  isInvalid?: boolean;
  controlled?: boolean;
  value?: string | number;
  onChange?: (value: string | number) => void;
}

export const InputField = (props: InputFieldProps) => {
  const {
    name,
    label,
    isRequired = false,
    placeholder,
    type,
    isInvalid,
    controlled,
    ...rest
  } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext() ?? { formState: {} };

  const { isMobile } = useScreenSize()

  if (controlled) {
    return (
      <Field.Root required={isRequired}>
        {label && (
          <Field.Label htmlFor={name}>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
        )}

        <Input
          size="sm"
          {...rest}
          id={name}
          value={props.value}
          placeholder={placeholder}
          type={type}
          onChange={(e) => {
            let value: string | number = e.target.value;
            if (type === 'number') {
              value = +value;
            }
            props.onChange?.(value);
          }}
        />
      </Field.Root>
    );
  }

  const rawError = errors[name];
  const errorMessage =
    typeof rawError === 'object' &&
    rawError !== null &&
    'message' in rawError &&
    typeof rawError.message === 'string'
      ? rawError.message
      : undefined;

  return (
    <Field.Root invalid={isInvalid ?? !!errorMessage} required={isRequired}>
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
            size="sm"
            {...rest}
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
