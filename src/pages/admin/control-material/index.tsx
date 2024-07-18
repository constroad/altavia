import {
  Button,
  Flex,
  useDisclosure,
  Grid,
  GridItem,
  Spinner,
  Select,
  Text,
  NumberInput,
  NumberInputField,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useKardex } from 'src/common/hooks/useKardex';
import { useMaterials } from 'src/common/hooks/useMaterials';
import { SearchIcon, TrashIcon } from 'src/common/icons';
import { IntranetLayout, Modal, TableComponent } from 'src/components';
import { KardexForm } from 'src/components/kardex/KardexForm';
import { MacReferences } from 'src/components/kardex/MacReferences';
import { generateMaterialsColumns } from 'src/components/material/columnsConfig';
import { IKardexSchema } from 'src/models/kardex';
import { IMaterialSchema } from 'src/models/material';
import { CONSTROAD_COLORS } from 'src/styles/shared';

const StockPage = () => {
  const [materialSelected, setMaterialSelected] = useState<IMaterialSchema>();
  const [kardexSelected, setKardexSelected] = useState<IKardexSchema>();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [wantToProduce, setWantToProduce] = useState(0);

  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  // API
  const {
    controlledMaterials,
    isLoading,
    refetch,
    materialsMap,
    onUpdateControlledMaterials,
  } = useMaterials();
  const {
    kardexWithBalance,
    onDeleteKardex,
    initialValues,
    refetchKardex,
    deletingKardex,
    onSearch,
    isLoading: isLoadingKardex,
    monthList,
    yearList,
  } = useKardex({
    month,
    year,
    materialId: materialSelected?._id,
  });

  const columnsMaterial = generateMaterialsColumns({
    isKardex: true,
    onUpdateRow: (data) => {
      const updatedData = controlledMaterials.map((x) => {
        if (x._id === data._id) {
          return { ...x, ...data };
        }
        return x;
      });
      onUpdateControlledMaterials(updatedData);
    },
  });

  //handlers
  const handleCloseKardexModal = () => {
    onClose();
    setKardexSelected(undefined);
  };

  const handleComputeDose = () => {
    const metarialsUpdated = controlledMaterials.map((material) => {
      const { percent, quantity } = material;
      let needed = 0;
      let toBuy = 0;
      let toProduce = 0;

      if (wantToProduce && percent) {
        needed = Number((wantToProduce * percent).toFixed(2));
        toBuy = Number((quantity - needed).toFixed(2));
      }
      if (percent) {        
        toProduce = Number((quantity / (percent ?? 0)).toFixed(1));
      }

      return { ...material, toProduce, needed, toBuy: toBuy > 0 ? 0 : toBuy };
    });
    onUpdateControlledMaterials(metarialsUpdated);
  };

  if (isLoading || isLoadingKardex) return <Spinner />;

  const deleteFooter = (
    <Button
      isLoading={deletingKardex}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={() =>
        onDeleteKardex(kardexSelected?._id!, () => {
          onCloseDelete();
          setKardexSelected(undefined);
          refetch();
          refetchKardex();
        })
      }
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout title="Kardex & Materiales">
      <Flex gap={3} flexDir="column" fontSize={12}>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          gap={6}
        >
          <GridItem w="100%">
            <TableComponent
              toolbar={
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex alignItems="center" gap={2}>
                    <Box
                      p={2}
                      bgColor={CONSTROAD_COLORS.yellow}
                      fontWeight={600}
                    >
                      Quiero producir:
                    </Box>
                    <Flex alignItems="center">
                      <NumberInput
                        textAlign="center"
                        size="xs"
                        defaultValue={0}
                        width="50px"
                        onBlur={(e) => {
                          if (e.target.value === wantToProduce?.toString())
                            return;
                          setWantToProduce(Number(e.target.value ?? '0'));
                        }}
                      >
                        <NumberInputField
                          fontSize="inherit"
                          paddingInlineEnd={0}
                        />
                      </NumberInput>
                      m3
                    </Flex>
                  </Flex>
                  <Button size="xs" p={2} onClick={handleComputeDose}>
                    Calcular
                  </Button>
                </Flex>
              }
              data={controlledMaterials}
              columns={columnsMaterial}
              isLoading={isLoading}
              tableProps={{
                mb: 0,
              }}
            />
          </GridItem>
          <GridItem w="100%">
            <MacReferences />
          </GridItem>
        </Grid>

        <Flex flexDir="column">
          <h1 className="font-bold text-[15px]">Gestión de Kardex</h1>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap={2} justifyContent="center">
              <label>
                Mes:
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {monthList.map((x) => (
                    <option key={x.value} value={x.value}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Año:
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {yearList.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </label>
              <Flex flexDir={{base: 'column', md: 'row'}} alignItems="center">
                <Text fontSize={{ base: 12 }}>Material:</Text>
                <Select
                  defaultValue=""
                  size="sm"
                  width={{ base: '90px', md: '200px' }}
                  onChange={(e) =>
                    setMaterialSelected(materialsMap[e.target.value])
                  }
                  fontSize={12}
                  value={materialSelected?._id ?? ''}
                >
                  <option value="">Todos</option>
                  {controlledMaterials.map((x) => (
                    <option key={`filter-${x._id}`} value={x._id}>
                      {x.name}-{x.description}
                    </option>
                  ))}
                </Select>
              </Flex>
              <Button autoFocus onClick={onSearch} size="sm">
                <SearchIcon size="18px" />
              </Button>
            </Flex>
            <Button autoFocus onClick={onOpen} size="sm" colorScheme="yellow">
              + Agregar
            </Button>
          </Flex>
          <table className="border">
            <thead>
              <tr className="border bg-black text-white">
                <th className="py-2">Fecha</th>
                <th>Concepto</th>
                <th>Entradas</th>
                <th>Salidas</th>
                <th className="bg-[#FFC718] !text-black">Saldo</th>
                <th>Entradas ($)</th>
                <th>Salidas ($)</th>
                <th className="bg-[#FFC718] !text-black">Saldo ($)</th>
                <th>Costo Unitario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              <tr className="font-bold bg-[whitesmoke] text-[14px]">
                <td colSpan={4} className="font-bold py-2">
                  Saldo Inicial
                </td>
                <td className="text-center">{initialValues.quantity}</td>
                <td colSpan={2}></td>
                <td className="text-center">{initialValues.value}</td>
                <td colSpan={2}></td>
              </tr>
              {kardexWithBalance.map((entry) => (
                <tr key={entry._id} className="border hover:bg-[whitesmoke]">
                  <td className="text-center">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td>
                    {entry.type}-{materialsMap[entry.materialId]?.name}
                    {materialsMap[entry.materialId]?.description && (
                      <>({materialsMap[entry.materialId]?.description})</>
                    )}
                    <Text color="gray" fontSize={9}>
                      {entry.description}
                    </Text>
                  </td>
                  <td className="text-center">
                    {entry.type === 'Ingreso' ? entry.quantity : ''}
                  </td>
                  <td className="text-center text-red-500">
                    {entry.type === 'Salida' ? `-${entry.quantity}` : ''}
                  </td>
                  <td className="text-center">{entry?.balanceQuantity.toFixed(2)}</td>
                  <td className="text-center">
                    {entry.type === 'Ingreso' ? entry.value : ''}
                  </td>
                  <td className="text-center text-red-500">
                    {entry.type === 'Salida' ? `-${entry.value}` : ''}
                  </td>
                  <td className="text-center">{entry?.balanceValue.toFixed(2)}</td>
                  <td className="text-center">{entry.unitCost.toFixed(2)}</td>
                  <td className="text-center">
                    <Button
                      size="xs"
                      onClick={() => {
                        setKardexSelected(entry);
                        onOpenDelete();
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* transport form modal */}
          <Modal
            hideCancelButton
            isOpen={isOpen}
            onClose={handleCloseKardexModal}
            heading={kardexSelected ? 'Editar Kardex' : 'Añadir Kardex'}
          >
            <KardexForm
              materials={controlledMaterials}
              onSuccess={() => {
                onClose();
                refetch();
                refetchKardex();
              }}
            />
          </Modal>

          {/* delete transport modal */}
          <Modal
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            heading={`¿Estás seguro de eliminar este material ${kardexSelected?.quantity}?`}
            footer={deleteFooter}
          />
        </Flex>
      </Flex>
    </IntranetLayout>
  );
};

export default StockPage;
