import React, { useState } from 'react'

import { Input } from '@chakra-ui/input'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Box, Text, Flex } from '@chakra-ui/react'
import { Select } from '@chakra-ui/select'


type OptionType = {
  label: string;
  value: string;
}

interface CustomSelectProps {
  id: string;
  label?: string;
  inputLabel?: string;
  options: OptionType[]
  onChange: (value: string) => void;
  required?: boolean;
  value?: string;
}

export const FormSelect = (props: CustomSelectProps) => {
  const { options, label, inputLabel, value: phaseValue } = props;
  const [value, setValue] = useState<string>(phaseValue ?? '');
  const [inputValue, setInputValue] = useState<string>('')
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const newOptions = [...options, { label: 'PERSONALIZAR FASE', value: 'CUSTOM' }]

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value.toUpperCase() as string;

    if (newValue === 'CUSTOM') {
      setIsCustom(true);
      setValue(newValue);
    } else {
      setIsCustom(false);
      setValue(newValue);
      props.onChange(newValue)
    }
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.toUpperCase() as string;
    setInputValue(newValue)
    props.onChange(newValue)
  }

  return (
    <FormControl id={props.id}>
      <Flex justifyContent='space-between' alignItems='end'>
        <Flex flexDir='column' w='49%'>
          {label && (
            <FormLabel fontSize={{ base: 10, md: 12 }} fontWeight={600} mb='2px'>
              {label} {!props.required ? <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text> : <Text color='red' fontSize={10} display='inline-block'>*</Text>}
            </FormLabel> 
          )}
          <Select
            placeholder="SELECCIONA UNA FASE"
            value={value}
            onChange={handleChangeSelect}
            maxH='28px'
            minH='28px'
            h='28px'
            fontSize={{ base: 10, md: 12 }}
            rounded='6px'
            style={{ paddingLeft: '5px' }}
            required={props.required}
          >
            {newOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </Flex>

        {isCustom && (
          <Box w='49%'>
            {inputLabel && (
              <FormLabel fontSize={{ base: 10, md: 12 }} fontWeight={600} mb='2px'>
                {inputLabel} {!props.required ? <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text> : <Text color='red' fontSize={10} display='inline-block'>*</Text>}
              </FormLabel> 
            )}
            <Input
              placeholder="Fase personalizada"
              px='5px'
              maxH='28px'
              minH='28px'
              h='28px'
              fontSize={{ base: 10, md: 12 }}
              rounded='6px'
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e)}
            />
          </Box>
        )}
      </Flex>
    </FormControl>
  );
};

export default FormSelect;
