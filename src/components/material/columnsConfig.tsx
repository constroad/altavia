import { Box, Flex, Text } from '@chakra-ui/react';
import { TableColumn } from 'src/components';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { formatMoney } from 'src/utils/general';

const SummaryAmount = (value: number, bgColor?: string) => {
  return (
    <Box
      as={Flex}
      alignItems="center"
      justifyContent="center"
      bgColor={bgColor ?? 'black'}
      color={bgColor ? 'inherit' : 'white'}
      fontWeight={600}
      fontSize={11}
      height={30}
      gap={1}
    >
      {formatMoney(value)}
      <Text>m3</Text>
    </Box>
  );
};

export const generateMaterialsColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Material',
      width: '20%',
    },
    {
      key: 'unit',
      label: 'Unidad',
      width: '10%',
      textAlign: 'center',
    },
    {
      key: 'quantity',
      textAlign: 'center',
      label: 'Cantidad',
      width: '10%',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      summary: (value) => SummaryAmount(value),
    },
  ];

  return columns;
};
