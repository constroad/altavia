import { TableColumn } from '../Table';

export const generateTransportColumns = (
) => {
  const columns: TableColumn[] = [
    {
      key: 'company',
      label: 'Transportista',
      width: '20%',
    },
    { key: 'plate', label: 'Placa', width: '10%' },
    {
      key: 'driverName',
      label: 'Conductor',
      width: '10%',
    },
    {
      key: 'driverCard',
      label: 'Licencia',
      width: '10%',
    },
    { key: 'phone', label: 'Celular', width: '5%' },
  ];

  return columns;
};
