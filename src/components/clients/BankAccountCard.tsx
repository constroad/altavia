import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { copyToClipboard } from 'src/common/utils/copyToClipboard';
import { CopyIcon } from 'src/common/icons';
import { BankAccountType } from './utils'

interface BankAccountCardProps {
  bankAccount: BankAccountType | undefined;
  isMobile?: boolean
}

export const BankAccountCard = (props: BankAccountCardProps) => {
  const { bankAccount, isMobile } = props;
  return (
    <Flex
      flexDir='column'
      fontSize={ isMobile ? 10 : 14 }
      rounded='4px'
      px='10px'
      py={ isMobile ? '3px' : '5px' }
      border='1px solid'
      borderColor='lightgray'
      gap={isMobile ? 1 : 2}
      width='100%'
    >
      <Flex width='100%'>
        <Text fontWeight={600} width='110px'>Banco:</Text> {bankAccount?.name}
      </Flex>

      <Flex width='100%'>
        <Text fontWeight={600} width='110px'>Nro cuenta:</Text> {bankAccount?.accountNumber}
        {bankAccount?.accountNumber !== '' && (
          <Button
            ml='10px'
            maxWidth={ isMobile ? '25px' : '30px' }
            height={ isMobile ? '15px' : '20px' }
            fontSize={10}
            onClick={() => copyToClipboard(bankAccount?.accountNumber, 'Nro de cuenta copiado')}
          >
            <CopyIcon fontSize={18}/>
          </Button>
        )}
      </Flex>

      <Flex>
        <Text fontWeight={600} width='110px'>CCI:</Text> {bankAccount?.cci}
        {bankAccount?.cci !== '' && (
          <Button
            ml='10px'
            maxWidth={ isMobile ? '25px' : '30px' }
            height={ isMobile ? '15px' : '20px' }
            fontSize={10}
            onClick={() => copyToClipboard(bankAccount?.cci, 'CCI copiado')}
          >
            <CopyIcon fontSize={18}/>
          </Button>
        )}
      </Flex>
      
      <Flex>
        <Text fontWeight={600} width='110px'>Tipo:</Text> {bankAccount?.type}
      </Flex>
    </Flex>
  )
}

export default BankAccountCard
