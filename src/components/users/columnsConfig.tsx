import { useScreenSize } from 'src/common/hooks';
import { TableColumn } from '../Table';

export const generateUserColumns = () => {
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
      key: 'userName',
      label: 'Nombre de usuario',
      width: '10%',
      render: (item, row) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
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
