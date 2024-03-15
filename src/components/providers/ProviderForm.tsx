import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { BankAccountType, FormBankAccCard, initialBankAcc } from '../clients';
import { FormInput, FormTextarea } from '../form';
import { ProviderType } from './utils';
import { Tag } from '../tag';
import { PlusIcon, SubstracIcon } from 'src/common/icons';
import { CONSTROAD_COLORS } from 'src/styles/shared';

interface ProviderFormProps {
  handleSubmit: (event: { preventDefault: () => void }) => void;
  provider: ProviderType
  setter: React.Dispatch<React.SetStateAction<ProviderType>> | React.Dispatch<React.SetStateAction<ProviderType | undefined>>;
  providerSelected: ProviderType | undefined;
}

export const ProviderForm = (props: ProviderFormProps) => {
  const { handleSubmit, provider, setter } = props
  const [tagValue, setTagValue] = useState('')
  const [addEditbankAccount, setAddEditbankAccount] = useState(false)
  const [bankAccount, setBankAccount] = useState(initialBankAcc)
  const [bankAccountsList, setBankAccountsList] = useState<BankAccountType[]>(provider.bankAccounts)
  const [editingBankAcc, setEditingBankAcc] = useState(false)
  const [bankAccountIndex, setBankAccountIndex] = useState<number>(0)

  // effects
  useEffect(() => {
    if ( setter ) {
      setter({...provider, bankAccounts: bankAccountsList})
    }
  }, [bankAccountsList])

  useEffect(() => {
    if (!addEditbankAccount) {
      setBankAccount(initialBankAcc)
      setEditingBankAcc(false)
    }
  }, [addEditbankAccount])

  // handlers
  const handleChangeValue = (value: string, key: string) => {
    if ( setter ) setter({ ...provider, [key]: value })
  }

  const handleChangeBankAccountValue = (value: string, key: string) => {
    setBankAccount({...bankAccount, [key]: value})
  }

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    handleSubmit(e)
  }

  const handleAddBankAccount = () => {
    const listIncludesBankAcc = provider.bankAccounts.some(
      acc => acc.accountNumber === bankAccount.accountNumber
    );

    if (!listIncludesBankAcc) {
      const newList = [...bankAccountsList, bankAccount]
      setBankAccountsList(newList)
      setter({...provider, bankAccounts: newList})
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

  const handleAddString = () => {
    if (provider.tags && tagValue !== '') {
      const newTagsArr = [...provider.tags, tagValue]
      setter({...provider, tags: newTagsArr})
      setTagValue('')
    }
  };

  const handleDeleteTag = (tagStr: string) => {
    if (provider.tags) {
      const newTagsArr = provider.tags.filter(tag => tag !== tagStr)
      setter({...provider, tags: newTagsArr})
    }
  }

  return (
    <Box
      as='form'
      onSubmit={(e: { preventDefault: () => void }) => handleSubmitForm(e)}
      id='add-or-edit-provider-form'
    >
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
        gap={2}
      >
        <GridItem colSpan={2}>
          <FormInput
            id='provider-name'
            label='Razón social'
            value={provider.name ?? ''}
            placeholder='Razón social del proveedor'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'name')}
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='provider-alias'
            label='Alias'
            value={provider.alias ?? ''}
            placeholder='Alias del proveedor'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'alias')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='provider-ruc'
            label='RUC'
            value={provider.ruc ?? ''}
            placeholder='20987654321'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'ruc')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='provider-contact-person'
            label='Persona de contacto'
            value={provider.contactPerson ?? ''}
            placeholder='Jhon Doe'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'contactPerson')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='provider-phone'
            label='Teléfono'
            value={provider.phone ?? ''}
            placeholder='987654321'
            onChange={(e) => handleChangeValue(e.target.value, 'phone')}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <FormInput
            id='provider-address'
            label='Dirección'
            value={provider.address ?? ''}
            placeholder='Av. Placeholder Mz. A Lt. 1'
            onChange={(e) => handleChangeValue(e.target.value, 'address')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='provider-email'
            label='Correo'
            value={provider.email ?? ''}
            placeholder='example@gmail.com'
            onChange={(e) => handleChangeValue(e.target.value, 'email')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='provider-web'
            label='Web'
            value={provider.web ?? ''}
            placeholder='www.someweb.com'
            onChange={(e) => handleChangeValue(e.target.value, 'web')}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <FormTextarea
            id='provider-notes'
            label='Notas'
            value={provider.notes ?? ''}
            placeholder='Notas'
            onChange={(e) => handleChangeValue(e.target.value, 'notes')}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <FormTextarea
            id='provider-description'
            label='Descripción'
            value={provider.description ?? ''}
            placeholder='Descripción'
            onChange={(e) => handleChangeValue(e.target.value, 'description')}
          />
        </GridItem>

        {/* Tags */}
        <GridItem colSpan={2}>
          <FormControl id="provider-note">
            <FormLabel mb='6px' fontSize={{ base: 10, md: 12 }}>
              Etiquetas <Text color='gray' fontSize={8} display='inline-block'>(optional)</Text>
            </FormLabel>
            <InputGroup>
              <Input
                _placeholder={{ fontSize: 12 }}
                px={{ base: '5px', md: '3px' }}
                fontSize={{ base: 10, md: 12 }}
                lineHeight='14px'
                height='28px'
                type="text"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                placeholder="Etiquetas"
              />
              <InputRightElement width="4.5rem" height='28px'>
                <Button h="24px" my='auto' size="sm" onClick={handleAddString} fontSize={10} bg={CONSTROAD_COLORS.black} color='white' _hover={{ bg: CONSTROAD_COLORS.darkGray }}>
                  Agregar
                </Button>
              </InputRightElement>
            </InputGroup>
            <Flex mt='4px' gap={1} flexWrap="wrap" width='100%'>
              {provider.tags?.map(tag => (               
                <Tag key={tag} tag={tag} onDelete={() => handleDeleteTag(tag)} />
              ))}
            </Flex>
          </FormControl>
        </GridItem>
      </Grid>

      <Flex fontWeight={600} mt='15px' fontSize={{base: 11, md: 12 }} width='100%' justifyContent='space-between' alignItems='center'>
        <Text>Cuentas bancarias: {provider.bankAccounts.length > 0 && `(${provider.bankAccounts.length})`}</Text>
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

      {/* Bank account form */}
      {addEditbankAccount && (
        <Box border='1px solid' borderColor='lightgray' px='10px' py='10px' rounded='8px' mt='5px'>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
            gap={2}
            mt='5px'
          >
            <GridItem>
              <FormInput
                id='provider-bankAccount-name'
                label='Banco'
                value={bankAccount.name ?? ''}
                placeholder='BCP'
                onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'name')}
                required
              />
            </GridItem>

            <GridItem>
              <FormInput
                id='provider-bankAccount-number'
                label='Número de cuenta'
                value={bankAccount.accountNumber ?? ''}
                placeholder='000-0000000-00'
                onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'accountNumber')}
                required
              />
            </GridItem>

            <GridItem>
              <FormInput
                id='provider-bankAccount-cci'
                label='CCI'
                value={bankAccount.cci ?? ''}
                placeholder='000-0000000-0000-00'
                onChange={(e) => handleChangeBankAccountValue(e.target.value.toUpperCase(), 'cci')}
                required
              />
            </GridItem>

            <GridItem>
              <FormInput
                id='provider-bankAccount-type'
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
                  fontSize={{ base: 10, md: 12 }}
                  height='29px'
                  colorScheme='red'
                  onClick={handleCancelBankAcc}
                >
                  Cancelar
                </Button>
                <Button
                  size='sm'
                  maxWidth={editingBankAcc ? '110px' : '60px'}
                  fontSize={{ base: 10, md: 12 }}
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

      {/* Add Edit Bank accounts card */}
      {!addEditbankAccount && (
        <Flex flexDir='column' gap={1} mt='5px'>
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
              onEditClick={handleEditBankAccClick}
              onDeleteClick={handleDeleteBankAccount}
            />
          ))}
        </Flex>
      )}
    </Box>
  )
}

export default ProviderForm;
