import { TableColumn } from '../Table';

export const generatePedidoColumns = (
) => {
  const columns: TableColumn[] = [
    {
      key: 'cliente',
      label: 'Cliente',
      width: '20%',
    },
    { key: 'tipoMAC', label: 'Mac', width: '10%' },
    {
      key: 'fechaProgramacion',
      label: 'Fecha',
      width: '10%',
      render: (item) => (
        <>{item.split("T")[0]}</>
        ),
    },
    { key: 'totalPedido', label: 'S/.', width: '5%' },
  ];

  return columns;
};
