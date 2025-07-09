import { Text } from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { formatUtcDateTime } from '@/utils/general';

export const generateAlertColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      width: '20%',
      render: (item, row) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'dueDate',
      label: 'Vencimiento',
      width: '10%',
      render: (item, row) => (
        <>
          <Text>{formatUtcDateTime(item)}</Text>
        </>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      width: '10%',
      render: (item) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      width: '10%',
      render: (item) => (
        <>
          {item}
        </>
      ),
    }
  ];

  return columns;
};
