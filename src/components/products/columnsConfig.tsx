import { Button } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { ProductType } from "./utils"

export const generateProductColumns = () => {
  const columns: TableColumn[] = [
    // { key: 'name', label: 'Nombre', width: '15%' },
    { key: 'description', label: 'Descripción', width: '50%' },
    { key: 'alias', label: 'Alias', width: '5%' },
    { key: 'unit', label: 'Unidad', width: '5%' },
    { key: 'quantity', label: 'Cantidad', width: '5%' },
    { key: 'unitPrice', label: 'Precio', width: '5%' },
  ]
  return columns
}

export const generateMobileProdColumns = (handleSelectProduct: (row: ProductType) => void) => {
  const columns: TableColumn[] = [
    { key: 'description', label: 'Nombre', width: '40%' },
    {
      key: 'alias',
      label: 'Ver',
      width: '5%',
      render: (item, row) => (
        <Button onClick={() => handleSelectProduct(row)} size='md' maxWidth='40px' maxHeight='25px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    },
  ]
  return columns
}