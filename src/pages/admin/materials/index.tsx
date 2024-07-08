import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { IntranetLayout, Modal, TableComponent } from 'src/components';
import { MaterialForm } from 'src/components/material/MaterialForm';
import { IMaterialSchema } from 'src/models/material';
import { generateMaterialsColumns } from '../../../components/material/columnsConfig';
import { useMaterials } from 'src/common/hooks/useMaterials';

interface MaterialsProps {}

const Materials = () => {
  const [materialSelected, setMaterialSelected] = useState<IMaterialSchema>();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();

  // API
  const { materials, isLoading, onDeleteMaterial, refetch, deletingMaterial } =
    useMaterials();

  // handlers
  const handleCloseMaterialModal = () => {
    onClose();
    setMaterialSelected(undefined);
  };

  const columns = generateMaterialsColumns();

  const deleteFooter = (
    <Button
      isLoading={deletingMaterial}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={() => onDeleteMaterial(materialSelected?._id!, () => {
        onCloseDelete()
        setMaterialSelected(undefined);
      })}
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout title='Materiales'>
      <Flex flexDir="column" width="100%" gap={2} mt={5}>
        <Flex width="100%" justifyContent="space-between">
          <Text
            fontSize={{ base: 25, md: 36 }}
            fontWeight={700}
            color="black"
            lineHeight={{ base: '28px', md: '39px' }}
          >
            Materiales
          </Text>

          <Button autoFocus onClick={onOpen}>
            Agregar
          </Button>
        </Flex>

        <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={materials}
            columns={columns}
            onDelete={(item) => {
              setMaterialSelected(item);
              onOpenDelete();
            }}
            onEdit={(item) => {
              setMaterialSelected(item);
              onOpen();
            }}
            isLoading={isLoading}
            pagination
            actions
          />
        </Box>
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

export default Materials;
