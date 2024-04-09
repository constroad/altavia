import React from 'react'
import { Flex, Input, Switch, Text } from '@chakra-ui/react'
import { CONSTROAD_COLORS } from 'src/styles/shared'
import { formatPriceNumber } from 'src/common/utils'
import { ProdInfoType } from './new-utils'

interface AccordionProfitContentProps {
  totales: any[]
  totalCost: any;
  totalCost2: any;
  addIGV: boolean;
  handleChangeAddIGV: any;
  prodInfo: ProdInfoType;
  profit: number;
  profitPercentage: number;
  priceM3: number;
  setPriceM3: any;
  quotedCost: number;
  detraction: number;
}

export const AccordionProfitContent = (props: AccordionProfitContentProps) => {
  const { totales, totalCost, totalCost2, addIGV, handleChangeAddIGV, prodInfo, profitPercentage, priceM3, setPriceM3, quotedCost, profit, detraction } = props;
  return (
    <Flex flexDir='column' w='100%'>
      <Flex fontSize={{ base: 10, md: 12 }} fontWeight={600} w='100%' bg={CONSTROAD_COLORS.darkGray} color='white' border='0.5px solid' borderColor='black' px='4px' alignItems='center' h='19px'>COSTOS</Flex>
      {totales.map((x, idx) => (
        <Flex key={`totales-${idx}`} w='100%'>
          <Input
            w='52%'
            fontWeight={600}
            rounded='0px'
            value={x.title}
            h='19px'
            fontSize={{ base: 10, md: 11 }}
            px='4px'
            disabled
            _disabled={{ bg: 'white', cursor: 'normal' }}
          />
          <Input
            w='24%'
            rounded='0px'
            value={formatPriceNumber(+x.value)}
            h='19px'
            fontSize={{ base: 10, md: 11 }}
            px='4px'
            textAlign='end'
            disabled
            _disabled={{ bg: 'white', cursor: 'normal' }}
          />
          <Input
            w='24%'
            rounded='0px'
            value={formatPriceNumber(+x.value2)}
            h='19px'
            fontSize={{ base: 10, md: 11 }}
            px='4px'
            textAlign='end'
            disabled
            _disabled={{ bg: 'white', cursor: 'normal' }}
          />
        </Flex>
      ))}
      <Flex>
        <Input
          variant='unstyled'
          rounded='0px'
          value='Total'
          h='19px'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          border='0.5px solid'
          fontWeight={600}
          disabled
          w='52%'
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
        <Input
          rounded='0px'
          value={ formatPriceNumber(totalCost) }
          h='19px'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='4px'
          textAlign='end'
          w='24%'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
        <Input
          rounded='0px'
          value={ formatPriceNumber(totalCost2) }
          h='19px'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='4px'
          textAlign='end'
          w='24%'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
      </Flex>

      <Flex w='100%' justifyContent='space-between' mt='4px'>
        <Flex width='50%' alignItems='center' gap='5px'>
          <Text fontSize={{ base: 10, md: 10 }} fontWeight={600} >¿Aplicar IGV?</Text>
          <Flex gap='10px' alignItems='center' marginTop='0px'>
            <Switch size="sm" onChange={handleChangeAddIGV} isChecked={addIGV} />
            <Text fontSize={{ base: 10, md: 10 }} fontWeight={600}>{addIGV ? 'Sí' : 'No'}</Text>
          </Flex>
        </Flex>
        <Flex h='17px' fontSize={{ base: 10, md: 11 }} w='24%' flexDir='column'>
          <Flex border='0.5px solid' borderColor='black' w='100%' px='4px' h='17px' bg={CONSTROAD_COLORS.yellow} fontWeight={600} justifyContent='center'>Costo (m2)</Flex>
          <Flex border='0.5px solid' borderColor='black' w='100%' px='4px' h='17px' justifyContent='end' fontWeight={600}>{formatPriceNumber(+totalCost2 / prodInfo.metrado)}</Flex>
        </Flex>
      </Flex>

      <Flex mt='30px' fontSize={{ base: 10, md: 12 }} fontWeight={600} w='100%' bg={CONSTROAD_COLORS.darkGray} color='white' border='0.5px solid' borderColor='black' px='4px' h='19px' alignItems='center'>CALCULAR GANANCIA</Flex>
      <Flex mt='0px'>
        <Input
          variant='unstyled'
          rounded='0px'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          fontWeight={600}
          value='Metrado (m2)'
          textAlign='center'
          border='0.5px solid'
          h='19px'
          disabled
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
        <Input
          variant='unstyled'
          rounded='0px'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          fontWeight={600}
          value='Precio venta (m2)'
          textAlign='center'
          border='0.5px solid'
          h='19px'
          disabled
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
        <Input
          variant='unstyled'
          rounded='0px'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          fontWeight={600}
          value='Total'
          textAlign='end'
          border='0.5px solid'
          h='19px'
          disabled
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
      </Flex>
      <Flex>
        <Input
          variant='unstyled'
          rounded='0px'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          fontWeight={600}
          value={prodInfo.metrado}
          textAlign='center'
          border='0.5px solid'
          h='19px'
          disabled
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
        <Input
          bg={CONSTROAD_COLORS.yellow}
          rounded='0px'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          fontWeight={600}
          color='red'
          value={priceM3 === 0 ? '' : priceM3}
          onChange={(e) => setPriceM3(+e.target.value)}
          type='number'
          textAlign='center'
          border='0.5px solid black'
          h='19px'
        />
        <Input
          variant='unstyled'
          rounded='0px'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          fontWeight={600}
          value={formatPriceNumber(quotedCost)}
          textAlign='end'
          border='0.5px solid'
          h='19px'
          disabled
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
      </Flex>

      <Flex mt='0px'>
        <Input
          w='66.6%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='2px'
          textAlign='center'
          rounded='0px'
          value='Gastos de obra'
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
        <Input
          w='33.4%'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          textAlign='end'
          rounded='0px'
          value={ formatPriceNumber(totalCost) }
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
      </Flex>

      <Flex mt='0px'>
        <Input
          w='66.6%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='2px'
          textAlign='center'
          rounded='0px'
          value={`Ganancia (${ profitPercentage.toFixed(1) }%)`}
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
        <Input
          w='33.4%'
          fontSize={{ base: 10, md: 11 }}
          px='4px'
          textAlign='end'
          rounded='0px'
          value={ formatPriceNumber(profit) }
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
      </Flex>

      <Flex mt='0px'>
        <Input
          w='66.6%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          color='red'
          px='2px'
          textAlign='center'
          rounded='0px'
          value='Detracción'
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
        <Input
          w='33.4%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='4px'
          textAlign='end'
          color='red'
          rounded='0px'
          value={formatPriceNumber(detraction)}
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
      </Flex>

      <Flex mt='0px'>
        <Input
          variant='unstyled'
          w='66.6%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='2px'
          textAlign='center'
          rounded='0px'
          value='Ganancia sin detracción'
          h='19px'
          border='0.5px solid'
          disabled
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
        <Input
          w='33.4%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='4px'
          textAlign='end'
          rounded='0px'
          value={formatPriceNumber(profit - detraction)}
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
      </Flex>

      <Flex mt='5px' w='33.4%' ml='auto' flexDir='column'>
        <Input
          variant='unstyled'
          w='100%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='2px'
          textAlign='center'
          rounded='0px'
          value='Ganancia por día'
          h='19px'
          border='0.5px solid'
          disabled
          _disabled={{ bg: CONSTROAD_COLORS.yellow, cursor: 'normal' }}
        />
        <Input
          w='100%'
          fontSize={{ base: 10, md: 11 }}
          fontWeight={600}
          px='4px'
          textAlign='end'
          rounded='0px'
          value={formatPriceNumber( (profit - detraction) / prodInfo.days )}
          h='19px'
          disabled
          _disabled={{ bg: 'white', cursor: 'normal' }}
        />
      </Flex>
    </Flex>
  )
}

export default AccordionProfitContent;
