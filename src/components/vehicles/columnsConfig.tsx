import { useScreenSize } from 'src/common/hooks';
import { TableColumn } from '../Table';

export const generateVehicleColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'plate',
      label: 'Placa',
      width: '20%',
      render: (item, row) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'brand',
      label: 'Marca',
      width: '10%',
      render: (item, row) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'modelVehicle',
      label: 'Modelo',
      width: '10%',
      render: (item) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'year',
      label: 'Año fab.',
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
