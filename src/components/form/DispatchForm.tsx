import { Box, Button, FormControl, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Dispatch } from 'src/common/types';
import { formatPriceNumber, getDate } from 'src/common/utils';

interface DispathFormProps {
  handleSubmit: (event: { preventDefault: () => void }) => void;
  dispatch: Dispatch
  setter: React.Dispatch<React.SetStateAction<Dispatch>>
}

export const DispatchForm = (props: DispathFormProps) => {
  const { handleSubmit, dispatch, setter } = props
  const [subtotal, setSubtotal] = useState('')
  const { slashDate } = getDate()

  useEffect(() => {
    const subt = +dispatch.m3 * +dispatch.price
    setSubtotal(formatPriceNumber(subt))
  }, [])
  

  useEffect(() => {
    setter({...dispatch, date: slashDate})
  }, [])

  const handleChangeValue = (value: string, key: string) => {
    const uppercaseValue = value.toUpperCase()
    if (key === 'm3') {
      const subtotal = +value * +dispatch.price
      const igv = subtotal * 0.18
      const total = subtotal + igv
      const formattedSubtotal = formatPriceNumber(subtotal)
      const formattedIgv = formatPriceNumber(igv)
      const formattedTotal = formatPriceNumber(total)
      setSubtotal(formattedSubtotal)

      setter({ ...dispatch, igv: formattedIgv, total: formattedTotal, [key]: uppercaseValue })

    } else if ( key === 'price' ) {
      const subtotal = +value * +dispatch.m3
      const igv = subtotal * 0.18
      const total = subtotal + igv
      const formattedSubtotal = formatPriceNumber(subtotal)
      const formattedIgv = formatPriceNumber(igv)
      const formattedTotal = formatPriceNumber(total)
      setSubtotal(formattedSubtotal)

      setter({ ...dispatch, igv: formattedIgv, total: formattedTotal, [key]: uppercaseValue })

    } else {
      setter({ ...dispatch, [key]: uppercaseValue });
    }
  }

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    handleSubmit(e)
    const subt = +dispatch.m3 * +dispatch.price
    setSubtotal(formatPriceNumber(subt))
  }

  return (
    <Box as='form' onSubmit={(e: { preventDefault: () => void }) => handleSubmitForm(e)}>
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(10, 1fr)" }}
        gap={2}
      >
        <GridItem colSpan={2}>
          <FormControl id="material"width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Material</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type="text"
              value={dispatch.material}
              placeholder="MEZCLA ASFALTICA"
              onChange={(e) => handleChangeValue(e.target.value, 'material')}
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="client" width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Cliente</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type='text'
              value={dispatch.client}
              onChange={(e) => handleChangeValue(e.target.value, 'client')}
              placeholder='GLOBO FAST'
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="proyect" width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Obra</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type='text'
              value={dispatch.project}
              onChange={(e) => handleChangeValue(e.target.value, 'project')}
              placeholder='ICA'
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="plate" width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Placa</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type="text"
              value={dispatch.plate}
              onChange={(e) => handleChangeValue(e.target.value, 'plate')}
              placeholder="ABC-123"
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="invoice">
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Factura</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type="text"
              value={dispatch.invoice}
              onChange={(e) => handleChangeValue(e.target.value, 'invoice')}
              placeholder="E001-1"
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="guide"width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Guia</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type="text"
              value={dispatch.guide}
              onChange={(e) => handleChangeValue(e.target.value, 'guide')}
              placeholder="EG01-00001"
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="carrier" width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Transportista</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type='text'
              value={dispatch.carrier}
              onChange={(e) => handleChangeValue(e.target.value, 'carrier')}
              placeholder='NOMBRE'
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="nro-cubos"width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>M3 </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type='number'
              value={dispatch.m3}
              onChange={(e) => handleChangeValue(e.target.value, 'm3')}
              placeholder='1'
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="price" width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Precio</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type='number'
              value={dispatch.price}
              onChange={(e) => handleChangeValue(e.target.value, 'price')}
              placeholder='480'
              required
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Subtotal</FormLabel>
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            value={subtotal}
            placeholder='subtotal'
            disabled
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>IGV</FormLabel>
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            value={dispatch.igv}
            placeholder='18%'
            disabled
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Total</FormLabel>
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            value={dispatch.total}
            placeholder='subtotal + igv'
            disabled
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl id="payment-done" width={{ base: '', md: '' }}>
            <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Pagos</FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12, md: 14 }}
              lineHeight='14px'
              height='32px'
              type='text'
              value={dispatch.paymentDone}
              onChange={(e) => handleChangeValue(e.target.value, 'paymentDone')}
              placeholder=''
              required
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Box mt='10px'>
        <Button
          type="submit"
          // isLoading={isLoading}
          loadingText="Enviando"
          colorScheme="blue"
          size={{ base: 'sm', md: 'md' }}
        >
          submit
        </Button>
      </Box>
    </Box>
  )
}

export default DispatchForm
