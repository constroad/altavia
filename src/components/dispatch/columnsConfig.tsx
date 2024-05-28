import { Flex, Text } from '@chakra-ui/react';
import { TableColumn } from '../Table';

export const generateDispatchColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'description',
      label: 'Description',
      width: '10%',
      render: (item, row) => {
        return <Flex flexDir="column">
          <Text>{item}</Text>
          <Text color="gray">{row.date}</Text>
        </Flex>;
      },
    },
    {
      key: 'client',
      label: 'Cliente',
      width: '20%',
      render: (item, row) => {
        return <Flex flexDir="column">
          <Text>{item}</Text>
          <Text>{row.clientRuc}</Text>
        </Flex>;
      },
    },
    {
      key: 'company',
      label: 'Transportista',
      width: '20%',
      render: (item, row) => {
        return <Flex flexDir="column">
          <Text>{item}</Text>
          <Text>{row.plate}</Text>
        </Flex>;
      },
    },
    {
      key: 'quantity',
      label: 'M3',
      width: '10%',
    },
    {
      key: 'price',
      label: 'Precio',
      width: '10%',
    },
    {
      key: 'obra',
      label: 'Obra',
      width: '10%',
    },
    { key: 'total', label: 'Total', width: '5%' },
  ];

  return columns;
};
