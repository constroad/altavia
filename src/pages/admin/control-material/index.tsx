// pages/stock.tsx
import { Button, Flex, useDisclosure, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { IntranetLayout, Modal, toast } from 'src/components';
import { KardexForm } from 'src/components/kardex/KardexForm';
import { MaterialForm } from 'src/components/material/MaterialForm';
import { GETAllKardex, IKardexSchema } from 'src/models/kardex';
import { IMaterialSchema } from 'src/models/material';

const fetcher = (path: string) => axios.get(path);
const deleter = (path: string) => axios.delete(path);

const StockPage = () => {
  const [materialSelected, setMaterialSelected] = useState<IMaterialSchema>();
  const [kardexSelected, setKardexSelected] = useState<IKardexSchema>();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [initialValues, setInitialValues] = useState({ quantity: 0, value: 0 });

  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  // API
  const {
    run: runGetMaterials,
    data: materialResponse,
    isLoading,
    refetch,
  } = useAsync<IMaterialSchema[]>();
  const {
    run: runGetKardex,
    data: kardexResponse,
    isLoading: isLoadingKardex,
    refetch: refetchKardex,
  } = useAsync<GETAllKardex>();
  const { run: runDeleteMaterial, isLoading: deletingMaterial } = useAsync();
  const { run: runDeleteKardex, isLoading: deletingKardex } = useAsync();

  useEffect(() => {
    runGetMaterials(fetcher(API_ROUTES.material), {
      refetch: () => runGetMaterials(fetcher(API_ROUTES.material)),
      cacheKey: API_ROUTES.material,
    });
  }, []);

  useEffect(() => {
    const path = `${API_ROUTES.kardex}?month=${month}&year=${year}`;
    runGetKardex(fetcher(path), {
      refetch: () => runGetKardex(fetcher(path)),
      cacheKey: API_ROUTES.kardex,
      onSuccess: (response) => {
        const { quantity, value } = response.data.initialValues ?? {};
        setInitialValues({ quantity: quantity ?? 0, value: value ?? 0 });
      },
    });
  }, [month, year]);

  // handlers
  const handleCloseMaterialModal = () => {
    onClose();
    setMaterialSelected(undefined);
  };
  const handleDeleteTransport = () => {
    runDeleteMaterial(
      deleter(`${API_ROUTES.material}/${materialSelected?._id}`),
      {
        onSuccess: () => {
          toast.success(`Eliminaste el pedido ${materialSelected?.name}`);
          setMaterialSelected(undefined);
          onCloseDelete();
          refetch();
        },
      }
    );
  };

  const handleDelete = async () => {
    runDeleteKardex(deleter(`${API_ROUTES.material}/${kardexSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste el kardex ${kardexSelected?._id}`);
        setKardexSelected(undefined);
        // onCloseDelete();
        refetch();
        refetchKardex();
      },
    });
  };

  const computeBalance = (kardex: IKardexSchema[]) => {
    let balanceQuantity = initialValues.quantity;
    let balanceValue = initialValues.value;

    return kardex.map((entry) => {
      if (entry.type === 'Ingreso') {
        balanceQuantity += entry.quantity;
        balanceValue += entry.value ?? 0;
      } else if (entry.type === 'Salida') {
        balanceQuantity -= entry.quantity;
        balanceValue -= entry.value ?? 0;
      }

      return {
        ...entry,
        balanceQuantity,
        balanceValue,
        unitCost: balanceQuantity !== 0 ? balanceValue / balanceQuantity : 0,
      };
    });
  };

  const materialsMap = Object.fromEntries(
    (materialResponse?.data ?? []).map((x) => [x._id, x])
  );

  const kardexWithBalance = computeBalance(kardexResponse?.data?.kardex ?? []);

  if (isLoading) return <div>Cargando...</div>;

  const deleteFooter = (
    <Button
      isLoading={deletingMaterial}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={handleDeleteTransport}
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout>
      <Flex flexDir="column" width="100%" gap={2} mt={5}>
        <Flex width="100%" justifyContent="space-between">
          <Text fontSize={{ base: 25, md: 36 }} fontWeight={700} color="black">
            Kardex & Materiales
          </Text>

          <Button autoFocus onClick={onOpen} size="sm" colorScheme="yellow">
            Agregar Material
          </Button>
        </Flex>
      </Flex>

      <Flex gap={50}>
        <Flex flexDir="column">
          <h1>Stock de Agregados</h1>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {materialResponse?.data?.map((material) => (
                <tr key={material._id}>
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unit}</td>
                  <td>
                    <Button
                      autoFocus
                      onClick={() => {
                        onOpen();
                        setMaterialSelected(material);
                      }}
                      size="xs"
                    >
                      Editar
                    </Button>
                    <Button
                      autoFocus
                      onClick={() => {
                        onOpenDelete();
                        setMaterialSelected(material);
                      }}
                      size="xs"
                    >
                      x
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Flex>
        <Flex flexDir="column">
          <h1>Actualizar Kardex</h1>
          <KardexForm
            materials={materialResponse?.data ?? []}
            onSuccess={() => {
              refetch();
              refetchKardex();
            }}
          />
        </Flex>
      </Flex>

      <Flex flexDir="column">
        <h1>Gestión de Kardex</h1>
        <h2>Historial</h2>
        <div>
          <label>
            Mes:
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </label>
          <label>
            Año:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </label>
        </div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Entradas</th>
              <th>Salidas</th>
              <th>Saldo</th>
              <th>Entradas ($)</th>
              <th>Salidas ($)</th>
              <th>Saldo ($)</th>
              <th>Costo Unitario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4}>Saldo Inicial</td>
              <td>{initialValues.quantity}</td>
              <td colSpan={2}></td>
              <td>{initialValues.value}</td>
              <td colSpan={2}></td>
            </tr>
            {kardexWithBalance.map((entry) => (
              <tr key={entry._id}>
                {/* <td>{entry.materialId}</td>
                <td>{entry.type}</td>
                <td>{entry.quantity}</td>
                <td>{new Date(entry.date).toLocaleString()}</td> */}

                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>
                  {materialsMap[entry.materialId].name}-{entry.type}
                </td>
                <td>{entry.type === 'Ingreso' ? entry.quantity : ''}</td>
                <td>{entry.type === 'Salida' ? entry.quantity : ''}</td>
                <td>{entry?.balanceQuantity}</td>
                <td>{entry.type === 'Ingreso' ? entry.value : ''}</td>
                <td>{entry.type === 'Salida' ? entry.value : ''}</td>
                <td>{entry?.balanceValue}</td>
                <td>{entry.unitCost}</td>
                <td>
                  <Button size="xs" onClick={() => setKardexSelected(entry)}>
                    Editar
                  </Button>
                  <Button size="xs" onClick={() => setKardexSelected(entry)}>
                    x
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Flex>

      {/* transport form modal */}
      <Modal
        hideCancelButton
        isOpen={isOpen}
        onClose={handleCloseMaterialModal}
        heading={materialSelected ? 'Editar Material' : 'Añadir Material'}
      >
        <MaterialForm
          material={materialSelected}
          onClose={handleCloseMaterialModal}
          onSuccess={refetch}
        />
      </Modal>

      {/* delete transport modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este material ${materialSelected?.name}?`}
        footer={deleteFooter}
      />
    </IntranetLayout>
  );
};

export default StockPage;
