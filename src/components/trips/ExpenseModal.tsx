'use client';

import { useState } from 'react';
import { Input, Button, VStack, Text, Box } from '@chakra-ui/react';
import { Modal } from '../modal';
import { SelectField } from '../form';
import { EXPENSE_STATUS, EXPENSE_STATUS_MAP } from '@/models/generalExpense';
import { CopyPaste } from '../upload/CopyPaste';
import { useMutate } from '@/common/hooks/useMutate';
import { API_ROUTES, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { toast } from 'src/components';
import { useMedias } from '@/common/hooks/useMedias';

interface ExpenseModalProps {
  resourceId: string;
  open: boolean;
  onClose: () => void;
}

export const ExpenseModal = ({
  open,
  onClose,
  resourceId,
}: ExpenseModalProps) => {
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();

  const { mutate: mutateExpense, isMutating } = useMutate(API_ROUTES.expenses);
  const type = 'TRIP_EXPENSE';
  const  metadata = {
    tripId: resourceId
  }
  const { onUpload, isUploading } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: false,
    type,
    resourceId,
    onPasteMetadata: {
      fileName: uploadedFile?.name ?? `${type}_upload.jpg`,
      type,
      metadata,
    },
  });

  const handleSave = () => {
    if (!uploadedFile) {
      toast.error('Seleccione un archivo');
      return;
    }
    if (!description || !amount) return;

    const payload = {
      tripId:resourceId,
      description,
      amount,
      type: 'trip',
      status,
      date: new Date()
    };
    mutateExpense('POST', payload, {
      onSuccess: (response) => {
        toast.success('Gasto de viaje registrado');
        useFetch.mutate(API_ROUTES.expenses);
        // upload 
        
        onUpload(uploadedFile, {
          type,
          fileName: uploadedFile.name,
          metadata: {
            ...metadata,
            expenseId: response._id
          },
          onSuccess: () => {
            useFetch.mutate(API_ROUTES.media);            
          },
        });

        // reset
        setDescription('');
        setAmount('');
        setUploadedFile(undefined);
        onClose();
      },
    });
  };

  const onSelect = (file: File) => {
    setUploadedFile(file)
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      heading="Agregar Gasto"
      footer={
        <Button
          onClick={handleSave}
          colorScheme="blue"
          size="sm"
          loading={isMutating || isUploading}
        >
          Guardar gasto
        </Button>
      }
    >
      <VStack spaceY={4} w="100%">
        <Box w="100%">
          <Text>Descripción</Text>
          <Input
            size="sm"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box w="100%">
          <Text>Monto</Text>
          <Input
            size="sm"
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </Box>

        <SelectField
          width="100%"
          isRequired
          label="Estado"
          name="status"
          size="xs"
          controlled
          value={status}
          onChange={(value) => setStatus(value)}
          options={EXPENSE_STATUS.map((status) => ({
            value: status,
            label: EXPENSE_STATUS_MAP[status],
          }))}
        />
        <CopyPaste
          type="TRIP_EXPENSE"
          resourceId={resourceId}
          onSelect={onSelect}
        />
      </VStack>
    </Modal>
  );
};
