import React from 'react'
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react'

interface FormInputProps {
  id: string;
  label?: string;
  value: string | number | readonly string[] | undefined
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
}

export const FormInput = (props: FormInputProps) => {
  return (
    <FormControl id={props.id}>
      {props.label && (
        <FormLabel mb={{ base: '2px', md: '0px' }} fontSize={{ base: 10, md: 12 }}>
          {props.label} {!props.required ? <Text color='gray' fontSize={8} display='inline-block'>(opcional)</Text> : <Text color='red' fontSize={10} display='inline-block'>*</Text>}
        </FormLabel>
      )}
      <Input
        _placeholder={{ fontSize: {base: 10, md:12 } }}
        px={{ base: '5px', md: '3px' }}
        fontSize={{ base: 10, md: 12 }}
        lineHeight='14px'
        height='28px'
        type={props.type ?? 'text'}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        required={props.required ? true : false}
        disabled={props.disabled ? true : false}
      />
    </FormControl>
  )
}
