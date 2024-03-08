import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { PlusIcon, SubstracIcon } from 'src/common/icons';
import { BankAccountType, ClientType, initialBankAcc } from './utils';
import { FormInput } from '../form';
import { FormBankAccCard } from './FormBankAccCard';

interface ClientFormProps {
  handleSubmit: (event: { preventDefault: () => void }) => void;
  client: ClientType
  setter: React.Dispatch<React.SetStateAction<ClientType>> | React.Dispatch<React.SetStateAction<ClientType | undefined>>;
  clientSelected: ClientType | undefined;
}

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
    if ( setter ) setter({ ...client, [key]: value })
  }

  const handleChangeBankAccountValue = (value: string, key: string) => {
    setBankAccount({...bankAccount, [key]: value})
  }

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    handleSubmit(e)
  }

  const handleAddBankAccount = () => {
    const listIncludesBankAcc = client.bankAccounts.some( acc => acc.accountNumber === bankAccount.accountNumber );

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
    const listUpdated = bankAccountsList.filter( acc => acc.accountNumber !== account.accountNumber );
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
          <FormInput
            id='client-name'
            label='Nombre'
            value={client.name ?? ''}
            placeholder='Nombre del cliente'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'name')}
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='client-alias'
            label='Alias'
            value={client.alias ?? ''}
            placeholder='Alias del cliente'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'alias')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='client-ruc'
            label='RUC'
            value={client.ruc ?? ''}
            placeholder='20987654321'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'ruc')}
            required
          />
        </GridItem>

        <GridItem colSpan={2}>
          <FormInput
            id='client-address'
            label='Dirección'
            value={client.address ?? ''}
            placeholder='Av. Placeholder Mz. A Lt. 1'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'address')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='client-phone'
            label='Teléfono'
            value={client.phone ?? ''}
            placeholder='987654321'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'phone')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='client-email'
            label='Correo'
            value={client.email ?? ''}
            placeholder='example@gmail.com'
            onChange={(e) => handleChangeValue(e.target.value, 'email')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='client-web'
            label='Web'
            value={client.web ?? ''}
            placeholder='www.someweb.com'
            onChange={(e) => handleChangeValue(e.target.value, 'web')}
          />
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
        <Box border='1px solid' borderColor='lightgray' px='10px' py='10px' rounded='8px' mt='4px'>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
            gap={2}
            mt='10px'
          >
            <GridItem>
              <FormInput
                id='client-bankAccount-name'
                label='Banco'
                value={bankAccount.name ?? ''}
                placeholder='BCP'
                onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'name')}
                required
              />
            </GridItem>
            <GridItem>
              <FormInput
                id='client-bankAccount-number'
                label='Número de cuenta'
                value={bankAccount.accountNumber ?? ''}
                placeholder='000-0000000-00'
                onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'accountNumber')}
                required
              />
            </GridItem>
            <GridItem>
              <FormInput
                id='client-bankAccount-cci'
                label='Número de cuenta'
                value={bankAccount.cci ?? ''}
                placeholder='000-0000000000-0000-00'
                onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'cci')}
                required
              />
            </GridItem>
            <GridItem>
              <FormInput
                id='client-bankAccount-type'
                label='Tipo de cuenta'
                value={bankAccount.type ?? ''}
                placeholder='CORRIENTE'
                onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'type')}
                required
              />
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
            <FormBankAccCard
              key={acc.accountNumber}
              account={acc}
              index={idx}
              onEditClick={() => handleEditBankAccClick(acc, idx)}
              onDeleteClick={() => handleDeleteBankAccount(acc)}
            />
          ))}
        </Flex>
      )}
    </Box>
  )
}

export default ClientForm
