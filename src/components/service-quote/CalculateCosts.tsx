import React, { useEffect, useState } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import CostsTable from './CostsTable'
import AccordionProfitContent from './AccordionProfitContent';
import { ProdInfoType } from './new-utils';
import { CostsType } from './utils';

interface CalculateCostsProps {
  priceM3: number
  priceM2: number
  priceM3Setter: any
  priceM2Setter: any
  prodInfo: ProdInfoType;
  asphaltRows: any[];
  serviceRows: any[];
  imprimacionRows: any[];
  asphaltSetter: any
  serviceSetter: any
  imprimacionSetter: any
  thicknessRows: any[];
}

export const CalculateCosts = (props: CalculateCostsProps) => {
  const {
    priceM3,
    priceM2,
    priceM3Setter,
    priceM2Setter,
    prodInfo,
    asphaltRows,
    serviceRows,
    imprimacionRows,
    asphaltSetter,
    serviceSetter,
    imprimacionSetter,
    thicknessRows
  } = props;
  const [thicknessData, setThicknessData] = useState(thicknessRows)
  const [totales, setTotales] = useState<any[]>([])
  const [addIGV, setAddIGV] = useState(false)
  const [totalCost, setTotalCost] = useState(totales.reduce((total, row) => total + +row.value, 0))
  const [totalCost2, setTotalCost2] = useState(totales.reduce((total, row) => total + +row.value2, 0))
  
  useEffect(() => {
    const totalAsphalt = asphaltRows.reduce((total: any, row: any) => total + (+row['Total']), 0)
    const totalService = serviceRows.reduce((total: any, row: any) => total + (+row['Total']), 0)
    const newTotales = [
      { title: `Precio venta asfalto (M3)`, value: 0, value2: priceM3 * +prodInfo?.m3Produced },
      { title: 'Costo de producción asfalto', value: totalAsphalt, value2: 0 },
      { title: 'Costo Servicio (carpeta asfáltica)', value: totalService, value2: totalService },
    ]
    setTotales(newTotales)

  }, [asphaltRows, serviceRows, priceM3])

  useEffect(() => {
    const total = totales.reduce((total, row) => total + +row.value, 0)
    const total2 = totales.reduce((total, row) => total + +row.value2, 0)
    if (addIGV) {
      setTotalCost(total * 1.18)
      setTotalCost2(total2 * 1.18)
    } else {
      setTotalCost(total)
      setTotalCost2(total2)
    }
  }, [priceM3, addIGV, totales])
  

  const handleChangeAddIGV = () => {
    const total = totales.reduce((total, row) => total + +row.value, 0)
    const total2 = totales.reduce((total, row) => total + +row.value2, 0)
    if (addIGV) {
      setTotalCost(total * 1.18)
      setTotalCost2(total2 * 1.18)
      setAddIGV(false)
    } else {
      setTotalCost(total)
      setTotalCost2(total2)
      setAddIGV(true)
    }
  }

  const quotedCost = priceM2 * +prodInfo?.metrado
  const profit = quotedCost - totalCost
  const profitPercentage = profit / (quotedCost) * 100
  const detraction = quotedCost * 0.04

  return (
    <Accordion allowToggle w='100%' rounded='6px' h='100%' maxH='100%'>
      <AccordionItem rounded='5px'>
        <h2>
          <AccordionButton px='8px' py='4px'>
            <Box as="span" flex='1' textAlign='left' fontWeight={600} fontSize={{ base: 10, md: 12 }} textTransform='uppercase'>
              Costo de producción de asfalto
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel py='4px' px='8px' h='100%' maxH='100%' overflow='scroll'>
          <CostsTable
            keyString='asphalt'
            columns={['Insumo', 'Dosis', 'M3/GLS', 'Precio', 'Total']}
            rows={asphaltRows}
            setter={asphaltSetter}
            prodInfo={prodInfo}
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton px='8px' py='4px'>
            <Box as="span" flex='1' textAlign='left' fontWeight={600} fontSize={{ base: 10, md: 12 }} textTransform='uppercase'>
              Costo de servicios
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel py='4px' px='8px' h='100%' maxH='100%' overflow='scroll'>
          <CostsTable
            keyString='service'
            columns={['Item', 'Cantidad', 'Precio', 'Total']}
            rows={serviceRows}
            setter={serviceSetter}
            prodInfo={prodInfo}
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton px='8px' py='4px'>
            <Box as="span" flex='1' textAlign='left' fontWeight={600} fontSize={{ base: 10, md: 12 }} textTransform='uppercase'>
              Costo de imprimación
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel py='4px' px='8px' h='100%' maxH='100%' overflow='scroll'>
          <CostsTable
            keyString='imprimacion'
            columns={['Item', 'Cantidad', 'Precio', 'Total']}
            rows={imprimacionRows}
            setter={imprimacionSetter}
            prodInfo={prodInfo}
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton px='8px' py='4px'>
            <Box as="span" flex='1' textAlign='left' fontWeight={600} fontSize={{ base: 10, md: 12 }} textTransform='uppercase' color='red'>
              Ganancias
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel py='4px' px='8px' h='100%' maxH='100%' overflow='scroll'>
          <AccordionProfitContent
            totales={totales}
            totalCost={totalCost}
            totalCost2={totalCost2}
            addIGV={addIGV}
            handleChangeAddIGV={handleChangeAddIGV}
            prodInfo={prodInfo}
            profit={profit}
            profitPercentage={profitPercentage}
            priceM2={priceM2}
            priceM3={priceM3}
            setPriceM2={priceM2Setter}
            setPriceM3={priceM3Setter}
            quotedCost={quotedCost}
            detraction={detraction}
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem rounded='5px'>
        <h2>
          <AccordionButton px='8px' py='4px'>
            <Box as="span" flex='1' textAlign='left' fontWeight={600} fontSize={{ base: 10, md: 12 }} textTransform='uppercase'>
              Pulgadas a CM
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel py='4px' px='8px' h='100%' maxH='100%' overflow='scroll'>
          <CostsTable
            keyString='thickness'
            columns={['Pulgadas', 'Centimetros']}
            rows={thicknessData}
            setter={setThicknessData}
            prodInfo={prodInfo}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default CalculateCosts
