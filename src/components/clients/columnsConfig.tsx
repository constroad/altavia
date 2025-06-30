import { useScreenSize } from 'src/common/hooks';
import { TableColumn } from '../Table';

export const generateClientColumns = () => {
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
      key: 'ruc',
      label: 'RUC',
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
    }
  ];

  return columns;
};
