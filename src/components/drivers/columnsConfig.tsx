import { Text } from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { formatUtcDateTime } from '@/utils/general';

export const generateDriverColumns = () => {
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
      key: 'dni',
      label: 'DNI',
      width: '10%',
      render: (item, row) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      width: '10%',
      render: (item) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'licenseNumber',
      label: 'Licencia',
      width: '10%',
      render: (item) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'licenseExpiry',
      label: 'Licencia Exp.',
      width: '10%',
      render: (item) => (
        <>
          { item !== undefined && (
            <Text>{formatUtcDateTime(item)}</Text> 
          )}
        </>
      ),
    }
  ];

  return columns;
};
