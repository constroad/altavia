import React, { useEffect, useState } from 'react'
import { Box, Input, InputGroup, InputLeftElement, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { SearchIcon } from 'src/common/icons';

interface Option {
  name?: string
  label?: string
  ruc?: string
}

interface SearchComponentProps<T> {
  options: T[];
  propertiesToSearch: (keyof T)[];
  onSelect: (selectedOption: T) => void;
  placeholder?: string;
}

export const SearchComponent = <T extends Option>(props: SearchComponentProps<T>) => {
  const { options, onSelect, propertiesToSearch, placeholder } = props;

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [openOptionBox, setOpenOptionBox] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 0 && filteredOptions.length > 0) {
      setOpenOptionBox(true)
    } else {
      setOpenOptionBox(false)
    }
  }, [searchTerm])
  

  const filteredOptions = options.filter(option => {
    return propertiesToSearch.some(property => {
      const value = option[property] as string
      const searchValue = value?.toLowerCase();
      return searchValue?.includes(searchTerm.toLowerCase());
    });
  });

  const handleSelectOption = (option: T) => {
    onSelect(option)
    setSearchTerm('')
    setOpenOptionBox(false)
  }

  return (
    <Box position='relative'>
      <InputGroup>
        <InputLeftElement pointerEvents="none" width='32px' height='32px'>
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder={placeholder}
          size='sm'
          roundedTop='6px'
          roundedBottom={openOptionBox ? '0px' : '6px'}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          fontSize={{ base: 12, md: 14 }}
          borderColor='#e2e8f0'
          ring='none'
          outline='none'
          _focus={{ outline: 'none', ring: '0px' }}
          _active={{ outline: 'none', ring: '0px' }}
        />
      </InputGroup>
      {openOptionBox && (
        <UnorderedList
          listStyleType="none"
          width='100%'
          ml={0}
          position='absolute'
          top='100%'
          bg='white'
          shadow='md'
          zIndex='1000'
          border='1px solid'
          borderTop='nonde'
          borderColor='#e2e8f0'
          roundedBottom='6px'
          roundedTop='0px'
          maxHeight='280px'
          overflowY='scroll'
        >
          {filteredOptions.map((option, idx) => (
            <ListItem
              key={option?.name || option.label || idx}
              display='flex'
              alignItems='center'
              cursor="pointer"
              borderTop='1px solid'
              borderColor='#e2e8f0'
              _hover={{ background: '#e2e8f0' }}
              px='10px'
              h='40px'
              onClick={() => handleSelectOption(option)}
            >
              <Text fontSize={10}>{option.name || option.label} - {option.ruc && option.ruc}</Text>
            </ListItem>
          ))}
        </UnorderedList>
      )}
    </Box>
  );
}

export default SearchComponent
