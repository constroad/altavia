import React from 'react'
import { FormControl, FormLabel, Text, Textarea } from '@chakra-ui/react'

interface FormTextareaProps {
  id: string;
  label?: string;
  value: string | number | readonly string[] | undefined
  placeholder?: string;
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined
}

export const FormTextarea = (props: FormTextareaProps) => {
  return (
    <FormControl id={props.id}>
      <FormLabel mb={{ base: '2px', md: '6px' }} fontSize={{ base: 10, md: 12 }}>
        {props.label} {!props.required ? <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text> : <Text color='red' fontSize={10} display='inline-block'>*</Text>}
      </FormLabel>
      <Textarea
        _placeholder={{ fontSize: 10 }}
        placeholder={props.placeholder}
        fontSize={{ base: 10, md: 12 }}
        lineHeight='13px'
        value={props.value}
        px={{ base: '5px', md: '3px' }}
        py={{ base: '2px', md: '4px' }}
        onChange={props.onChange}
        maxHeight='50px'
        minHeight='50px'
        height='50px'
        required={props.required ? true : false}
      />
    </FormControl>
  )
}
