import {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  ListItem,
  Spinner,
  UnorderedList,
} from '@chakra-ui/react';

import { ClickAwayListener } from '../clickAwayListener';
import { isEmpty } from 'lodash';

export interface IAutocompleteOptions {
  value: string;
  label: string;
  filter?: string;
}

export interface IDropdownOptions {
  onClose: () => void;
}
type IInputProps = Omit<InputProps, 'onChange' | 'placeholder'>;
type AutocompleteProps = {
  isLoading?: boolean;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
  options: IAutocompleteOptions[];
  renderOption?: (option: IAutocompleteOptions) => ReactNode;
  renderNoFound?: (options: IDropdownOptions) => ReactNode;
  onSearch?: (value: string) => void;
  onSelect?: (option: IAutocompleteOptions) => void;
  onEnter?: (value: string) => void;
  rightIcon?: ReactNode;
  inputProps?: IInputProps;
  displayOptions?: boolean;
};

export const AutoComplete = (props: AutocompleteProps) => {
  const { options, placeholder, value, displayOptions = true } = props;
  const [openResultBox, setOpenResultBox] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [localOptions, setLocalOptions] = useState<IAutocompleteOptions[]>([]);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    if (options.length > 0) {
      setLocalOptions(options);
    }
  }, [options]);

  //========= handlers =========
  const handleOnchange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value.length > 0) {
      const optionList = [...options].filter(
        (x) =>
        x.label.toLowerCase().includes(value) || x.filter?.toLowerCase()?.includes(value)
      );
      setLocalOptions([...optionList]);
    } else {
      setLocalOptions([...options]);
    }

    props.onChange?.(value);
    if (!displayOptions) {
      setOpenResultBox(false);
      return;
    }
    if (value.length > 0) {
      setOpenResultBox(true);
    } else {
      setOpenResultBox(false);
    }
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.onEnter?.(searchValue);
    }
  };

  const handleOnSelect = (option: IAutocompleteOptions) => {
    handleOnClose();
    props.onSelect?.(option);
  };
  const handleOnClose = () => {
    setOpenResultBox(false);
  };
  const handleOnInputClick = () => {
    setOpenResultBox(true);
  };
  const emptyOptions = isEmpty(localOptions);

  //========= renders =========
  return (
    <ClickAwayListener onClickAway={handleOnClose}>
      <Box
        data-testid="autocomplete-container"
        pointerEvents="auto"
        width="100%"
        background="white"
        lineHeight="20px"
        color="dark-gray-2"
        position="relative"
        borderColor="light-gray-3"
      >
        <InputGroup>
          <InputLeftElement width="32px" height="32px">
            <IoSearchSharp color="gray" fontSize={18} />
          </InputLeftElement>

          <Input
            placeholder={placeholder}
            fontSize="inherit"
            paddingY="3px"
            paddingLeft="30px"
            height="auto"
            onChange={handleOnchange}
            onClick={handleOnInputClick}
            value={searchValue}
            borderColor="inherit"
            borderRadius={openResultBox ? 0 : 6}
            onKeyDown={onKeyDown}
            aria-label="search"
            size={props.inputProps?.size ?? 'sm'}
            isDisabled={props.inputProps?.isDisabled ?? false}
            // {...props.inputProps}            
            _focus={{
              ring: 'none',
              roundedTop: 6,
              borderColor: 'light-gray-3',
            }}
          />
          {props.isLoading ? <Spinner /> : props.rightIcon}
        </InputGroup>
        <Box
          position="absolute"
          background="white"
          width="100%"
          maxHeight="150px"
          overflowY="auto"
          zIndex={openResultBox && !emptyOptions ? '100' : ''}
          border={openResultBox && !emptyOptions ? '1px solid' : ''}
          borderColor={openResultBox && !emptyOptions ? 'light-gray-3' : ''}
          roundedBottom={openResultBox && !emptyOptions ? '6px' : ''}
          paddingY={openResultBox && !emptyOptions ? 1 : 0}
        >
          <UnorderedList styleType="none" marginLeft="0px">
            {openResultBox &&
              localOptions.map((option) => {
                return (
                  <ListItem
                    key={option.value}
                    paddingX={2}
                    paddingY={1}
                    width="100%"
                    fontSize="inherit"
                    background="white"
                    _hover={{
                      background: 'light-gray-2',
                    }}
                    onClick={() => handleOnSelect(option)}
                  >
                    {props.renderOption
                      ? props.renderOption(option)
                      : option.label}
                  </ListItem>
                );
              })}
          </UnorderedList>
        </Box>
        {/* No found */}
        {openResultBox && emptyOptions && (
          <Box
            paddingX={1.5}
            paddingY={1}
            position="absolute"
            roundedBottom="6px"
            width="100%"
            background="white"
            border="1px solid"
            borderColor="light-gray-3"
            zIndex={100}
          >
            {props.renderNoFound ? (
              props.renderNoFound({
                onClose: handleOnClose,
              })
            ) : (
              <Flex
                alignItems="center"
                justifyContent="center"
                color="mid-gray-2"
                fontSize={12}
              >
                No Data found
              </Flex>
            )}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};
