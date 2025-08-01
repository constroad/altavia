import { formatISODate } from '@/utils/general';
import { TableColumn } from '../Table';
import { TelegramFileView } from '../telegramFileView';
import { Box } from '@chakra-ui/react';

export const generateMediaColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'type',
      label: 'Tipo',
      width: '20%',
      render: (item, row) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'name',
      label: 'Nombre',
      width: '10%',
      render: (item, row) => (
        <>
          {item}
        </>
      ),
    },
    {
      key: 'date',
      label: 'Fecha',
      width: '10%',
      render: (item) => {
        return <>{formatISODate(item)}</>;
      },
    },
    {
      key: 'url',
      label: 'Media',
      width: '10%',
      render: (item, row) => {
        return (
          <Box w='80px' maxW='80px' minW='80px'>
            <TelegramFileView
              key={row._id}
              media={row}
              description={''}
              // onRefresh={refetchMedias}
              imageStyle={{
                width: '80px',
                height: '80px',
              }}
            />
          </Box>
        )
      },
    },
  ];

  return columns;
};
