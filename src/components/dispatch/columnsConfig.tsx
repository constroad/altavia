import { Flex, Text } from '@chakra-ui/react';
import { TableColumn } from '../Table';

export const generateDispatchColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'description',
      label: 'Description',
      width: '20%',
      render: (item, row) => {
        return <Flex flexDir="column" lineHeight={3}>
          <Text>{item}</Text>
          <Text color="gray">Fecha:{row.date}</Text>
          <Text color="gray">obra:{row.obra}</Text>
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
        return <Flex flexDir="column" lineHeight={3}>
          <Text>{item}</Text>
          <Text color="gray">placa:{row.plate}</Text>
        </Flex>;
      },
    },
    {
      key: 'quantity',
      label: 'M3',
      width: '5%',
    },
    {
      key: 'price',
      label: 'Precio',
      width: '5%',
    },
    { key: 'total', label: 'Total', width: '5%' },
  ];

  return columns;
};
