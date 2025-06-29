'use client';

import { useEffect, useState } from 'react';
import { Input, Button, VStack, Text, Box, Show, Flex } from '@chakra-ui/react';
import { Modal } from '../modal';
import { SelectField } from '../form';
import {
  EXPENSE_STATUS,
  EXPENSE_STATUS_MAP,
  IExpenseSchema,
} from '@/models/generalExpense';
import { CopyPaste } from '../upload/CopyPaste';
import { useMutate } from '@/common/hooks/useMutate';
import { API_ROUTES, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { toast } from 'src/components';
import { useMedias } from '@/common/hooks/useMedias';
import { TelegramFileView } from '../telegramFileView';

interface ExpenseModalProps {
  expense?: IExpenseSchema;
  resourceId: string;
  open: boolean;
  onClose: () => void;
}

export const ExpenseModal = ({
  open,
  onClose,
  resourceId,
  expense,
}: ExpenseModalProps) => {
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setStatus(expense.status);
      setAmount(expense.amount);
    }
  }, [expense]);

  const { mutate: mutateExpense, isMutating } = useMutate(API_ROUTES.expenses);
  const type = 'TRIP_EXPENSE';
  const metadata = {
    tripId: resourceId,
  };
  const { onUpload, isUploading, medias, refetch } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: true,
    type,
    resourceId,
    onPasteMetadata: {
      fileName: uploadedFile?.name ?? `${type}_upload.jpg`,
      type,
      metadata,
    },
  });

  const handleSave = () => {
    if (!description || !amount) {
      toast.error('Ingrese datos obligatorios');
      return;
    }

    const payload = {
      tripId: resourceId,
      description,
      amount,
      type: 'trip',
      status,
      date: new Date(),
    };

    if (expense) {
      mutateExpense('PUT', payload, {
        requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
        onSuccess: (response) => {
          toast.success('Gasto Actualizado');
          useFetch.mutate(API_ROUTES.expenses);
          // upload
          if (uploadedFile) {
            onUpload(uploadedFile, {
              type,
              fileName: uploadedFile.name,
              metadata: {
                ...metadata,
                expenseId: response._id,
              },
              onSuccess: () => {
                useFetch.mutate(API_ROUTES.media);
                onClose();
                // reset
                setDescription('');
                setAmount('');
                setUploadedFile(undefined);
              },
            });
          } else {
            onClose();
            // reset
            setDescription('');
            setAmount('');
            setUploadedFile(undefined);
          }
        },
      });
      return;
    }
    if (!uploadedFile) {
      toast.error('Seleccione un archivo');
      return;
    }
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
            expenseId: response._id,
          },
          onSuccess: () => {
            useFetch.mutate(API_ROUTES.media);
            onClose();
            // reset
            setDescription('');
            setAmount('');
            setUploadedFile(undefined);
          },
        });
      },
    });
  };

  const onSelect = (file: File | File[]) => {
    if (file instanceof File) {
      setUploadedFile(file);
      return;
    }
    setUploadedFile(file[0]);
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
      <VStack spaceY={2} w="100%">
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
        <Box w="100%">
          <SelectField
            width="150px"
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
        </Box>
        <CopyPaste
          type="TRIP_EXPENSE"
          resourceId={resourceId}
          onSelect={onSelect}
          onPaste={onSelect}
        />
        <Show when={uploadedFile}>
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            {uploadedFile?.name}
            <Button
              size="xs"
              variant="outline"
              onClick={() => setUploadedFile(undefined)}
            >
              x
            </Button>
          </Flex>
        </Show>
        <Show when={medias?.length > 0}>
          <Flex gap={1}>
            {medias
              ?.filter?.((x) => x.metadata.expenseId === expense?._id)
              ?.map?.((media) => (
                <TelegramFileView
                  key={media._id}
                  media={media}
                  description={media.name}
                  canDelete
                  onRefresh={refetch}
                  imageStyle={{
                    height: '300px',
                  }}
                />
              ))}
          </Flex>
        </Show>
      </VStack>
    </Modal>
  );
};
