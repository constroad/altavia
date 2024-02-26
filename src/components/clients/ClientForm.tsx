import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, Input, Text } from '@chakra-ui/react'
import { EditIcon, PlusIcon, SubstracIcon, TrashIcon } from 'src/common/icons';
import { BankAccountType, ClientType } from './utils';

interface ClientFormProps {
  handleSubmit: (event: { preventDefault: () => void }) => void;
  client: ClientType
  setter: React.Dispatch<React.SetStateAction<ClientType>> | React.Dispatch<React.SetStateAction<ClientType | undefined>>;
  clientSelected: ClientType | undefined;
}

const initialBankAcc = {name: '', type: '', accountNumber: '', cci: ''}

export const ClientForm = (props: ClientFormProps) => {
  const { handleSubmit, client, setter } = props
  const [addEditbankAccount, setAddEditbankAccount] = useState(false)
  const [bankAccount, setBankAccount] = useState(initialBankAcc)
  const [bankAccountsList, setBankAccountsList] = useState<BankAccountType[]>(client.bankAccounts)
  const [editingBankAcc, setEditingBankAcc] = useState(false)
  const [bankAccountIndex, setBankAccountIndex] = useState<number>(0)

  useEffect(() => {
    if ( setter ) {
      setter({...client, bankAccounts: bankAccountsList})
    }
  }, [bankAccountsList])

  useEffect(() => {
    if (!addEditbankAccount) {
      setBankAccount(initialBankAcc)
      setEditingBankAcc(false)
    }
  }, [addEditbankAccount])

  const handleChangeValue = (value: string, key: string) => {
    if ( setter ) {
      setter({ ...client, [key]: value })
    }
  }

  const handleChangeBankAccountValue = (value: string, key: string) => {
    setBankAccount({...bankAccount, [key]: value})
  }

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    handleSubmit(e)
  }

  const handleAddBankAccount = () => {
    const listIncludesBankAcc = client.bankAccounts.some(
      acc => acc.accountNumber === bankAccount.accountNumber
    );

    if (!listIncludesBankAcc) {
      const newList = [...bankAccountsList, bankAccount]
      setBankAccountsList(newList)
      setter({...client, bankAccounts: newList})
    } else {
      alert('Esta cuenta bancaria ya existe')
    }
    
    setAddEditbankAccount(false)
    setBankAccount(initialBankAcc)
  }

  const handleEditBankAccount = () => {
    const newList = [...bankAccountsList]
    newList[bankAccountIndex] = bankAccount
    setBankAccountsList(newList)
  
    setBankAccount(initialBankAcc)
    setAddEditbankAccount(false)
    setEditingBankAcc(false)
  }

  const handleCancelBankAcc = () => {
    setAddEditbankAccount(false)
    setEditingBankAcc(false)
    setBankAccount(initialBankAcc)
  }

  const handleDeleteBankAccount = (account: BankAccountType) => {
    const listUpdated = bankAccountsList.filter(
      acc => acc.accountNumber !== account.accountNumber
    );
    setBankAccountsList(listUpdated)
  }

  const handleEditBankAccClick = (account: BankAccountType, index: number) => {
    setBankAccount(account)
    setBankAccountIndex(index)
    setAddEditbankAccount(true)
    setEditingBankAcc(true)
  }

  return (
    <Box
      as='form'
      onSubmit={(e: { preventDefault: () => void }) => handleSubmitForm(e)}
      id='add-or-edit-client-form'
    >
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
        gap={2}
      >
        <GridItem colSpan={2}>
          <FormControl id="client-name">
            <FormLabel mb='4px' fontSize={{ base: 10, md: 14 }}>
              Nombre <Text color='red' fontSize={8} display='inline-block'>(*)</Text>
            </FormLabel>
            <Input
              _placeholder={{ fontSize: 12 }}
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 10, md: 14 }}
              lineHeight='14px'
              height='28px'
              type="text"
              value={client?.name}
              placeholder="Client name"
              onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'name')}
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="client-alias">
            <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>
              Alias <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text>
            </FormLabel>
            <Input
              _placeholder={{ fontSize: 12 }}
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 10, md: 14 }}
              lineHeight='14px'
              height='28px'
              type='text'
              value={client.alias}
              onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'alias')}
              placeholder='alias'
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="proyect">
            <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>
              RUC <Text color='red' fontSize={8} display='inline-block'>(*)</Text>
            </FormLabel>
            <Input
              _placeholder={{ fontSize: 12 }}
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 10, md: 14 }}
              lineHeight='14px'
              height='28px'
              type='text'
              value={client.ruc}
              onChange={(e) => handleChangeValue(e.target.value, 'ruc')}
              placeholder='20192837465'
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="client-address">
            <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>
              Dirección <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text>
            </FormLabel>
            <Input
              _placeholder={{ fontSize: 12 }}
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 10, md: 14 }}
              lineHeight='14px'
              height='28px'
              type='text'
              value={client.address}
              onChange={(e) => handleChangeValue(e.target.value, 'address')}
              placeholder='Av. Placeholder Mz. A Lt. 1'
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="client-phone" width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>
              Teléfono <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text>
            </FormLabel>
            <Input
              _placeholder={{ fontSize: 12 }}
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 10, md: 14 }}
              lineHeight='14px'
              height='28px'
              type="text"
              value={client.phone}
              onChange={(e) => handleChangeValue(e.target.value, 'phone')}
              placeholder="+51 987654321"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="client-email">
            <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>
              Correo <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text>
            </FormLabel>
            <Input
              _placeholder={{ fontSize: 12 }}
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 10, md: 14 }}
              lineHeight='14px'
              height='28px'
              type="text"
              value={client.email}
              onChange={(e) => handleChangeValue(e.target.value, 'email')}
              placeholder="example@gmail.com"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="guide"width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>
              Web <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text>
            </FormLabel>
            <Input
              _placeholder={{ fontSize: 12 }}
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 10, md: 14 }}
              lineHeight='14px'
              height='28px'
              type="text"
              value={client.web}
              onChange={(e) => handleChangeValue(e.target.value, 'web')}
              placeholder="www.someweb.com"
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Flex fontWeight={600} mt='20px' fontSize={{base: 12, md: 14 }} width='100%' justifyContent='space-between'>
        <Text>Cuentas bancarias: {client.bankAccounts.length > 0 && `(${client.bankAccounts.length})`}</Text>
        <Button
          minWidth='20px'
          maxWidth='20px'
          height='20px'
          colorScheme='blue'
          paddingX='5px'
          verticalAlign='center'
          textAlign='center'
          onClick={() => setAddEditbankAccount(!addEditbankAccount)}
        >
          { !addEditbankAccount ? <PlusIcon fontSize={12} /> : <SubstracIcon fontSize={18} /> }
        </Button>
      </Flex>

      {addEditbankAccount && (
        <Box>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
            gap={2}
            mt='10px'
          >
            <GridItem>
              <FormControl id="client-bank-name">
                <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>Banco </FormLabel>
                <Input
                  _placeholder={{ fontSize: 12 }}
                  px={{ base: '5px', md: '3px' }}
                  fontSize={{ base: 10, md: 14 }}
                  lineHeight='14px'
                  height='28px'
                  type="text"
                  value={bankAccount.name}
                  onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'name')}
                  placeholder="bcp"
                  required
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="client-bank-account-number">
                <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>Número de cuenta </FormLabel>
                <Input
                  _placeholder={{ fontSize: 12 }}
                  px={{ base: '5px', md: '3px' }}
                  fontSize={{ base: 10, md: 14 }}
                  lineHeight='14px'
                  height='28px'
                  type="text"
                  value={bankAccount.accountNumber}
                  onChange={(e) => handleChangeBankAccountValue(e.target.value, 'accountNumber')}
                  placeholder="000-0000000-00"
                  required
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="client-bank-account-cci">
                <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>CCI </FormLabel>
                <Input
                  _placeholder={{ fontSize: 12 }}
                  px={{ base: '5px', md: '3px' }}
                  fontSize={{ base: 10, md: 14 }}
                  lineHeight='14px'
                  height='28px'
                  type="text"
                  value={bankAccount.cci}
                  onChange={(e) => handleChangeBankAccountValue(e.target.value, 'cci')}
                  placeholder="000-0000000000-0000-00"
                  required
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="client-bank-type">
                <FormLabel mb='6px' fontSize={{ base: 10, md: 14 }}>Tipo de cuenta </FormLabel>
                <Input
                  _placeholder={{ fontSize: 12 }}
                  px={{ base: '5px', md: '3px' }}
                  fontSize={{ base: 10, md: 14 }}
                  lineHeight='14px'
                  height='28px'
                  type="text"
                  value={bankAccount.type}
                  onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'type')}
                  placeholder="corriente"
                  required
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <Flex width='100%' justifyContent='space-between'>
                <Button
                  size='sm'
                  maxWidth='60px'
                  fontSize={12}
                  height='29px'
                  colorScheme='red'
                  onClick={handleCancelBankAcc}
                >
                  Cancelar
                </Button>
                <Button
                  size='sm'
                  maxWidth={editingBankAcc ? '110px' : '60px'}
                  fontSize={12}
                  height='29px'
                  colorScheme='blue'
                  onClick={!editingBankAcc ? handleAddBankAccount : handleEditBankAccount}
                >
                  {editingBankAcc ? 'Guardar cambios' : 'Añadir'}
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      )}

      {!addEditbankAccount && (
        <Flex flexDir='column' gap={1} mt='10px'>
          {bankAccountsList.length === 0 && (
            <Flex fontSize={12} fontWeight={600} width='100%' justifyContent='center'>
              No hay cuentas bancarias registradas
            </Flex>
          )}
          {bankAccountsList.map((acc, idx) => (
            <Flex
              key={acc.accountNumber}
              fontSize={10}
              fontWeight={400}
              justifyContent='space-between'
              rounded='4px' border='1px solid'
              borderColor='lightgray'
              p={1}
            >
              <Flex flexDir='column' gap='1px' fontWeight={600}>
                <Flex><Text width='50px'>Banco:</Text> {acc.name}</Flex>
                <Flex><Text width='50px'>Cuenta: </Text> {acc.accountNumber}</Flex>
                <Flex><Text width='50px'>CCI:</Text> {acc.cci}</Flex>
                <Flex><Text width='50px'>Tipo:</Text> {acc.type}</Flex>
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
                  onClick={() => handleEditBankAccClick(acc, idx)}
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
                  onClick={() => handleDeleteBankAccount(acc)}
                >
                  <TrashIcon fontSize={10}/>
                </Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  )
}

export default ClientForm
