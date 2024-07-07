import {
  Button,
  Flex,
  useDisclosure,
  Grid,
  GridItem,
  Spinner,
  Select,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { useKardex } from 'src/common/hooks/useKardex';
import { useMaterials } from 'src/common/hooks/useMaterials';
import { SearchIcon } from 'src/common/icons';
import { IntranetLayout, Modal, TableComponent } from 'src/components';
import { KardexForm } from 'src/components/kardex/KardexForm';
import { generateMaterialsColumns } from 'src/components/material/columnsConfig';
import { IKardexSchema } from 'src/models/kardex';
import { IMaterialSchema } from 'src/models/material';

const StockPage = () => {
  const [materialSelected, setMaterialSelected] = useState<IMaterialSchema>();
  const [kardexSelected, setKardexSelected] = useState<IKardexSchema>();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  // API
  const { materials, isLoading, refetch, materialsMap } = useMaterials();
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

  const columnsMaterial = generateMaterialsColumns();

  //handlers
  const handleCloseKardexModal = () => {
    onClose();
    setKardexSelected(undefined);
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
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={6}
        >
          <GridItem w="100%">
            <TableComponent
              itemsPerPage={100}
              data={materials}
              columns={columnsMaterial}
              isLoading={isLoading}
              tableProps={{
                mb: 0,
              }}
            />
          </GridItem>
          <GridItem w="100%" colSpan={2}>
            <h1>Calcular</h1>
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
              <Flex alignItems="center">
                <Text fontSize={{ base: 12 }}>Material:</Text>
                <Select
                  defaultValue=""
                  size="sm"
                  width={{ base: '90px', md: '200px' }}
                  onChange={(e) => setMaterialSelected(materialsMap[e.target.value])}
                  fontSize={12}
                  value={materialSelected?._id ?? ''}
                >
                  <option value="">Todos</option>
                  {materials.map((x) => (
                    <option key={`filter-${x._id}`} value={x._id}>
                      {x.name}
                    </option>
                  ))}
                </Select>
                {/* <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {yearList.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select> */}
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
            <tbody>
              <tr className="font-bold bg-[whitesmoke]">
                <td colSpan={4} className="font-bold py-2">
                  Saldo Inicial
                </td>
                <td className="text-center">{initialValues.quantity}</td>
                <td colSpan={2}></td>
                <td className="text-center">{initialValues.value}</td>
                <td colSpan={2}></td>
              </tr>
              {kardexWithBalance.map((entry) => (
                <tr key={entry._id} className="border">
                  <td className="text-center">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td>
                    {materialsMap[entry.materialId].name}-{entry.type}
                  </td>
                  <td className="text-center">
                    {entry.type === 'Ingreso' ? entry.quantity : ''}
                  </td>
                  <td className="text-center text-red-500">
                    {entry.type === 'Salida' ? `-${entry.quantity}` : ''}
                  </td>
                  <td className="text-center">{entry?.balanceQuantity}</td>
                  <td className="text-center">
                    {entry.type === 'Ingreso' ? entry.value : ''}
                  </td>
                  <td className="text-center text-red-500">
                    {entry.type === 'Salida' ? `-${entry.value}` : ''}
                  </td>
                  <td className="text-center">{entry?.balanceValue}</td>
                  <td className="text-center">{entry.unitCost.toFixed(2)}</td>
                  <td className="text-center">
                    <Button
                      size="xs"
                      onClick={() => {
                        setKardexSelected(entry);
                        onOpenDelete();
                      }}
                    >
                      x
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
              materials={materials}
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
