import { Flex, Tag } from '@chakra-ui/react';
import { TableColumn } from '../Table';

export const generatePedidoColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'fechaProgramacion',
      label: 'Fecha',
      width: '10%',
      render: (item, row) => (
        <Flex flexDir="column">
          {item.split('T')[0]}
          {row.isPaid ? (
            <Tag size="sm" colorScheme="green" width="fit-content">
              Pagado
            </Tag>
          ) : (
            <Tag size="sm" colorScheme="red" width="fit-content">
              Debe
            </Tag>
          )}
        </Flex>
      ),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      width: '20%',
    },
    { key: 'cantidadCubos', label: 'M3', width: '15%' },
    { key: 'obra', label: 'Obra', width: '15%' },
    { key: 'tipoMAC', label: 'Mac', width: '10%' },
    { key: 'totalPedido', label: 'S/.', width: '5%' },
  ];

  return columns;
};
