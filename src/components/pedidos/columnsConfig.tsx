import { Button } from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { IOrderValidationSchema } from 'src/models/order';

export const generatePedidoColumns = (
  handleSelect: (row: IOrderValidationSchema) => void
) => {
  const columns: TableColumn[] = [
    {
      key: 'cliente',
      label: 'Cliente',
      width: '20%',
    },
    { key: 'tipoMAC', label: 'Mac', width: '10%' },
    {
      key: 'fechaProgramacion',
      label: 'Fecha',
      width: '10%',
      render: (item) => (
        <>{item.split("T")[0]}</>
        ),
    },
    { key: 'totalPedido', label: 'S/.', width: '5%' },
    {
      key: 'web',
      label: 'VER',
      width: '5%',
      render: (item, row) => (
        <Button
          onClick={() => handleSelect(row)}
          size="md"
          px="5px"
          minW="30px"
          w="30px"
          maxWidth="30px"
          maxHeight="20px"
          fontSize={12}
          colorScheme="blue"
        >
          Ver
        </Button>
      ),
    },
  ];

  return columns;
};
