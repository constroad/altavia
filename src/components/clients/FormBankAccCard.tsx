import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { EditIcon, TrashIcon } from 'src/common/icons'
import { BankAccountType } from './utils'

interface FormBankAccCardProps {
  account: BankAccountType;
  index: number;
  onEditClick: (acc: BankAccountType, index: number) => void;
  onDeleteClick: (acc: BankAccountType) => void;
}

export const FormBankAccCard = (props: FormBankAccCardProps) => {
  const { account, index, onEditClick, onDeleteClick } = props;
  return (
    <Flex
      fontSize={10}
      fontWeight={400}
      justifyContent='space-between'
      rounded='4px' border='1px solid'
      borderColor='lightgray'
      p={1}
    >
      <Flex flexDir='column' gap='1px' fontWeight={600}>
        <Flex><Text width='50px'>Banco:</Text> {account.name}</Flex>
        <Flex><Text width='50px'>Cuenta: </Text> {account.accountNumber}</Flex>
        <Flex><Text width='50px'>CCI:</Text> {account.cci}</Flex>
        <Flex><Text width='50px'>Tipo:</Text> {account.type}</Flex>
      </Flex>

      <Flex flexDir='column' height='63px' justifyContent='space-between'>
        <Button
          colorScheme='gray'
          size='sm'
          minWidth='30px'
          maxWidth='25px'
          height='20px'
          paddingX='2px'
          fontSize={10}
          onClick={() => onEditClick(account, index)}
        >
          <EditIcon fontSize={12} />
        </Button>
        <Button
          colorScheme='red'
          size='sm'
          minWidth='30px'
          maxWidth='25px'
          height='20px'
          paddingX='2px'
          onClick={() => onDeleteClick(account)}
        >
          <TrashIcon fontSize={10}/>
        </Button>
      </Flex>
    </Flex>
  )
}
