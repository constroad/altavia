import {
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { TableColumn } from 'src/components';
import { IMaterialSchema } from 'src/models/material';
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
      {formatMoney(value, 1)}
      <Text>m3</Text>
    </Box>
  );
};
type IMeterialColumns = {
  isKardex?: boolean;
  onUpdateRow?: (data: IMaterialSchema) => void;
};
export const generateMaterialsColumns = (props?: IMeterialColumns) => {
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
      label: 'Stock',
      width: '10%',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      summary: (value) => SummaryAmount(value),
    },
  ];

  if (props?.isKardex) {
    columns.push({
      key: 'percent',
      label: 'Dosis',
      width: '10%',
      textAlign: 'center',
      render: (item, row) => {
        return (
          <NumberInput
            textAlign="center"
            size="xs"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value === item?.toString()) return;
              let percent = 0;
              if (e.target.value) {
                percent = Number(e.target.value);
              }
              // const toProduce = Number((row.quantity * (percent ?? 0)).toFixed(1))
              // let toBuy = row.quantity - toProduce
   
              props?.onUpdateRow?.({
                ...row,
                percent,
                // toProduce,
                // toBuy: toBuy > 0 ? 0 : toBuy
              });
            }}
          >
            <NumberInputField fontSize="inherit" paddingInlineEnd={0} />
          </NumberInput>
        );
      },
      summary: (value) => SummaryAmount(value),
    });
    columns.push({
      key: 'needed',
      label: 'Necesitas',
      width: '10%',
      textAlign: 'center',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      render: (item) => <>{item > 0 && item}</>,
    });
    columns.push({
      key: 'toProduce',
      label: 'Tengo',
      width: '10%',
      textAlign: 'center',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      render: (item) => <>{item > 0 && item}</>,
      summary: (value) => SummaryAmount(value),
    });
    columns.push({
      key: 'toBuy',
      label: 'Comprar',
      width: '10%',
      textAlign: 'center',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      render: (item) => <>{item > 0 && item}</>,
      summary: (value) => SummaryAmount(value),
    });
  }

  return columns;
};
