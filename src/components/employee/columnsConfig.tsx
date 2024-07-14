import { formatISODate } from 'src/utils/general';
import { TableColumn } from '../Table';

export const generateEmployeeColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Empleado',
      width: '20%',
      render: (item, row) => (
        <>
          {item}-{row.lastName}
        </>
      ),
    },
    { key: 'DOI', label: 'DNI', width: '5%' },
    {
      key: 'birthday',
      label: 'Cumpleaños',
      width: '5%',
      render: (item) => {
        return <>{formatISODate(item)}</>;
      },
    },
    {
      key: 'sex',
      label: 'Sexo',
      width: '5%',
    },
    {
      key: 'salary',
      label: 'Salario',
      width: '10%',
    },
    { key: 'civilStatus', label: 'Estado Civil', width: '5%' },
  ];

  return columns;
};
