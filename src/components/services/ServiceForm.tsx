import React, { useEffect, useState } from 'react'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import { FormInput, FormSelect } from '../form';
import { ServiceType } from './utils';

interface ServiceFormProps {
  handleSubmit: (event: { preventDefault: () => void }) => void;
  service: ServiceType;
  setter: React.Dispatch<React.SetStateAction<ServiceType>> | React.Dispatch<React.SetStateAction<ServiceType | undefined>>;
  serviceSelected: ServiceType | undefined;
  servicesDB: ServiceType[];
}

export const ServiceForm = (props: ServiceFormProps) => {
  const { handleSubmit, service, setter, servicesDB } = props
  const [phase, setPhase] = useState('')

  useEffect(() => {
    setter({ ...service, total: service.quantity * service.unitPrice, phase: phase })
  }, [service.quantity, service.unitPrice])

  // handlers
  const handleChangeValue = (value: string, key: string) => {
    if ( setter ) {
      if ( key === 'quantity' || key === 'unitPrice' ) {
        setter({ ...service, [key]: +value })
      } else {
        setter({ ...service, [key]: value })
      }
    }
  }

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    handleSubmit(e)
  }

  const handleChangeServicePhase = (pahseStr: string) => {
    setter({ ...service, phase: pahseStr })
  }

  const uniquePhasesSet = new Set<string>();

  const options = servicesDB
    .filter(service => service.phase)
    .map(service => ({ label: service.phase!, value: service.phase! }))
    .filter(option => {
        if (!uniquePhasesSet.has(option.value)) {
            uniquePhasesSet.add(option.value);
            return true;
        }
        return false;
    });

  return (
    <Box
      as='form'
      onSubmit={(e: { preventDefault: () => void }) => handleSubmitForm(e)}
      id='add-or-edit-service-form'
    >
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
        gap={2}
      >
        <GridItem colSpan={2}>
          <FormInput
            id='service-name'
            label='Nombre'
            value={service.description ?? ''}
            placeholder='Nombre del servicio'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'description')}
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='service-alias'
            label='Alias'
            value={service.alias ?? ''}
            placeholder='Alias del servicio'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'alias')}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <FormSelect
            id='service-phase'
            label='Fase de servicio'
            inputLabel='Ingresa la nueva fase'
            options={options}
            onChange={handleChangeServicePhase}
            required
            value={service.phase}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='service-unit'
            label='Unidad'
            value={service.unit ?? ''}
            placeholder='Unidad de medida'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'unit')}
            // required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='service-price'
            label='Precio U.'
            value={service.unitPrice === 0 ? '' : service.unitPrice}
            placeholder='0'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'unitPrice')}
            type='number'
            // required
          />
        </GridItem>
        
        <GridItem colSpan={1}>
          <FormInput
            id='service-quantity'
            label='Cantidad'
            value={service.quantity === 0 ? '' : service.quantity}
            placeholder='0'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'quantity')}
            type='number'
            // required
          />
        </GridItem>
      </Grid>
    </Box>
  )
}

export default ServiceForm;
