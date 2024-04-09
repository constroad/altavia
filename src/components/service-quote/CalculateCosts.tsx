import React, { useEffect, useState } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import CostsTable from './CostsTable'
import AccordionProfitContent from './AccordionProfitContent';
import { ProdInfoType } from './new-utils';

interface CalculateCostsProps {
  prodInfo: ProdInfoType;
  asphaltRows: any[];
  serviceRows: any[];
  imprimacionRows: any[];
  thicknessRows: any[];
}

export const CalculateCosts = (props: CalculateCostsProps) => {
  const { prodInfo, asphaltRows, serviceRows, imprimacionRows, thicknessRows } = props;
  const [asphaltData, setAsphaltData] = useState(asphaltRows)
  const [serviceData, setServiceData] = useState(serviceRows)
  const [imprimacionData, setImprimacionData] = useState(imprimacionRows)
  const [thicknessData, setThicknessData] = useState(thicknessRows)
  const [totales, setTotales] = useState<any[]>([])
  const [addIGV, setAddIGV] = useState(false)
  const [priceM3, setPriceM3] = useState(43)
  const [totalCost, setTotalCost] = useState(totales.reduce((total, row) => total + +row.value, 0))
  const [totalCost2, setTotalCost2] = useState(totales.reduce((total, row) => total + +row.value2, 0))

  useEffect(() => {
    const total = totales.reduce((total, row) => total + +row.value, 0)
    const total2 = totales.reduce((total, row) => total + +row.value2, 0)
    setTotalCost(total)
    setTotalCost2(total2)
  }, [totales])
  
  useEffect(() => {
    const totalAsphalt = asphaltData.reduce((total: any, row: any) => total + (+row['Total']), 0)
    const totalService = serviceData.reduce((total: any, row: any) => total + (+row['Total']), 0)
    const newTotales = [
      { title: 'Precio venta asfalto (m3 * 480)', value: 0, value2: 480 * +prodInfo.m3Produced },
      { title: 'Costo de producción asfalto', value: totalAsphalt, value2: 0 },
      { title: 'Costo Servicio (carpeta asfáltica)', value: totalService, value2: totalService },
    ]
    setTotales(newTotales)
  }, [asphaltData, serviceData, imprimacionData])

  const handleChangeAddIGV = () => {
    const total = totales.reduce((total, row) => total + +row.value, 0)
    const total2 = totales.reduce((total, row) => total + +row.value2, 0)
    if (addIGV === false) {
      setAddIGV(true)
      setTotalCost(total * 1.18)
      setTotalCost2(total2 * 1.18)
    } else {
      setAddIGV(false)
      setTotalCost(total)
      setTotalCost2(total2)
    }
  }

  const quotedCost = priceM3 * prodInfo.metrado
  const profit = (priceM3 * prodInfo.metrado) - totalCost
  const profitPercentage = ((priceM3 * prodInfo.metrado) - totalCost) / (priceM3 * prodInfo.metrado) * 100
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
            rows={asphaltData}
            setter={setAsphaltData}
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
            rows={serviceData}
            setter={setServiceData}
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
            rows={imprimacionData}
            setter={setImprimacionData}
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
            priceM3={priceM3}
            setPriceM3={setPriceM3}
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
