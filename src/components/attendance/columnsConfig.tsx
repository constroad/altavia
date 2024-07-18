import { formatISODate } from 'src/utils/general';
import { TableColumn } from '../Table';
import { Button } from '@chakra-ui/react';

export const generateAttendanceColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Empleado',
      width: '20%',
    },
    {
      key: 'date',
      label: 'Fecha',
      width: '5%',
      render: (item) => {
        return <>{formatISODate(item)}</>;
      },
    },
    {
      key: 'startTime',
      label: 'Ingreso',
      width: '5%',
    },
    {
      key: 'endTime',
      label: 'Salida',
      width: '5%',
    },
    {
      key: 'location',
      label: 'Ubicacion',
      width: '5%',
      render: (item) => {
        const handleOPenMap = () => {
          window.open(`https://maps.google.com/?q=${item.latitude},${item.longitude}`, '_blank')
        }
        return (
          <Button variant="link" size="xs" onClick={handleOPenMap}>ver Mapa</Button>
        );
      },
    },
  ];

  return columns;
};
