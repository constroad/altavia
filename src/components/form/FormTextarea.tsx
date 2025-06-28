import { useFormContext, Controller } from 'react-hook-form';
import { Field, Textarea } from '@chakra-ui/react';

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  height?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  label,
  placeholder,
  isRequired = false,
  height = '50px',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const rawError = errors[name];
  const errorMessage =
    typeof rawError === 'object' &&
    rawError !== null &&
    'message' in rawError &&
    typeof rawError.message === 'string'
      ? rawError.message
      : undefined;

  return (
    <Field.Root required={isRequired} invalid={!!errorMessage}>
      {label && (
        <Field.Label htmlFor={name} fontWeight={600} fontSize={14}>
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            id={name}
            {...field}
            placeholder={placeholder}
            fontSize={{ base: 10, md: 12 }}
            lineHeight="13px"
            px={{ base: '5px', md: '3px' }}
            py={{ base: '2px', md: '4px' }}
            height={height}
            minHeight={height}
            maxHeight={height}
          />
        )}
      />
      {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  );
};
