import React from 'react'
import { FormControl, FormLabel, Text, Textarea } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks';

interface FormTextareaProps {
  id: string;
  label?: string;
  value: string | number | readonly string[] | undefined
  placeholder?: string;
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined
  height?: string;
}

export const FormTextarea = (props: FormTextareaProps) => {
  const { isMobile, isDesktop } = useScreenSize()
  return (
    <FormControl id={props.id}>
      <FormLabel mb={{ base: '2px', md: '6px' }} fontSize={{ base: 10, md: 12 }}>
        {props.label} {!props.required ? <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text> : <Text color='red' fontSize={10} display='inline-block'>*</Text>}
      </FormLabel>
      <Textarea
        _placeholder={{ fontSize: isMobile ? 10 : 12 }}
        placeholder={props.placeholder}
        fontSize={{ base: 10, md: 12 }}
        lineHeight='13px'
        value={props.value}
        px={{ base: '5px', md: '3px' }}
        py={{ base: '2px', md: '4px' }}
        onChange={props.onChange}
        maxHeight={props.height ? props.height : '50px'}
        minHeight={props.height ? props.height : '50px'}
        height={props.height ? props.height : '50px'}
        required={props.required ? true : false}
      />
    </FormControl>
  )
}
