import { Box, Button, Flex, Text, Tooltip } from '@chakra-ui/react';
import { RefreshIcon, SaveIcon } from 'src/common/icons';
import { IDispatchList } from 'src/models/dispatch';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { formatMoney } from 'src/utils/general';

interface SummaryProps {
  listDispatch: IDispatchList[];
  onAddDispatch: () => void;
  onSaveDispatch: () => void;
  onRefreshDispatch: () => void;
  addindDispatch?: boolean;
  totalRecords?: number;
  total: number;
}

export const Summary = (props: SummaryProps) => {
  const {
    listDispatch,
    onRefreshDispatch,
    onAddDispatch,
    addindDispatch,
    totalRecords,
    total,
  } = props;
  return (
    <Flex alignItems="center" justifyContent="space-between" fontSize="12px">
      <Flex flexDir="column" fontSize="inherit" width="200px">
        <Flex>
          <Box width="30%" bgColor="black" color="white">
            M3:
          </Box>
          <Text flex={1} textAlign="right" bgColor={CONSTROAD_COLORS.yellow}>
            {listDispatch
              .map((x) => x.quantity)
              .reduce((prev, current) => prev + current, 0)}
          </Text>
        </Flex>
        <Flex>
          <Box width="30%" bgColor="black" color="white">
            Total:
          </Box>
          <Text textAlign="right" flex={1} bgColor={CONSTROAD_COLORS.yellow}>
            S/.
            {formatMoney(total)}
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems="center" gap={1}>
        <Text fontSize="inherit" display={{ base: 'none', md: 'block' }}>
          {listDispatch.length} de {totalRecords} Filas
        </Text>
        <Tooltip label="Actualizar">
          <Button autoFocus onClick={() => onRefreshDispatch()} size="sm">
            <RefreshIcon />
          </Button>
        </Tooltip>
        <Tooltip label="Agregar despacho">
          <Button
            autoFocus
            onClick={onAddDispatch}
            size="sm"
            isLoading={addindDispatch}
          >
            +
          </Button>
        </Tooltip>
        <Tooltip label="Guardar cambios">
          <Button autoFocus onClick={props.onSaveDispatch} size="sm">
            <SaveIcon />
          </Button>
        </Tooltip>
      </Flex>
    </Flex>
  );
};
