'use client';

import { useEffect, useState } from 'react';
import { Button, VStack, Show, Flex, Grid } from '@chakra-ui/react';
import { Modal } from '../modal';
import { InputField, SelectField } from '../form';
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
import { formatISODate } from '@/utils/general';

interface ExpenseModalProps {
  expense?: IExpenseSchema;
  resourceId: string;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const ExpenseModal = (props: ExpenseModalProps) => {
  const { open, onClose, resourceId, expense } = props;
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('paid');
  const [date, setDate] = useState(formatISODate(new Date()));
  const [amount, setAmount] = useState<number | ''>('');
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setStatus(expense.status);
      setAmount(expense.amount);
      setDate(formatISODate(expense.date));
    }
  }, [expense]);

  const isValidExpense = !!expense;

  const { mutate: mutateExpense, isMutating } = useMutate(API_ROUTES.expenses);
  const type = 'TRIP_EXPENSE';
  const metadata = {
    tripId: resourceId,
    expenseId: expense?._id,
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
        onSuccess: () => {
          toast.success('Gasto Actualizado');
          handleRefreshMedias()
          resetForm();          
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
        // upload
        onUpload(uploadedFile, {
          type,
          fileName: uploadedFile.name,
          metadata: {
            ...metadata,
            expenseId: response._id,
          },
          onSuccess: () => {
            handleRefreshMedias()
            handleClose();
          },
        });
      },
    });
  };

  function resetForm() {
    setDescription('');
    setAmount('');
    setUploadedFile(undefined);
  }

  const onSelect = (file: File | File[]) => {
    if (file instanceof File) {
      setUploadedFile(file);
      return;
    }
    setUploadedFile(file[0]);
  };

  const handleRefreshMedias = () => {
    useFetch.mutate(API_ROUTES.expenses);
    useFetch.mutate(API_ROUTES.media);
    props.onRefresh?.();
    refetch()
  }
  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} heading="Agregar Gasto">
      <VStack spaceY={0} w="100%" alignItems="start">
        <InputField
          size="xs"
          name="description"
          label="Descripcion"
          controlled
          value={description}
          onChange={(value) => setDescription(value as string)}
          isRequired
        />
        <Flex justifyContent="space-between" width="100%" gap={2}>
          <InputField
            type="date"
            size="xs"
            name="startDate"
            label="Fecha"
            controlled
            value={date}
            onChange={(value) => setDate(value as string)}
            isRequired
          />
          <InputField
            type="number"
            size="xs"
            name="startDate"
            label="Monto"
            controlled
            value={amount}
            onChange={(value) => setAmount(value as number)}
            isRequired
          />
        </Flex>

        <Flex justifyContent="space-between" width="100%" gap={2} alignItems="end">
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
          <Button
            onClick={handleSave}
            colorScheme="blue"
            size="xs"
            loading={isMutating || isUploading}
          >
            Guardar
          </Button>
        </Flex>

        <CopyPaste
          type="TRIP_EXPENSE"
          resourceId={resourceId}
          onSelect={!isValidExpense ? onSelect : undefined}
          onPaste={!isValidExpense ? onSelect : undefined}
          metadata={metadata}
          onSuccess={() => {
            handleRefreshMedias()            
          }}
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
          <Grid templateColumns="repeat(2, 1fr)" gap="2">
            {medias
              ?.filter?.((x) => x.metadata.expenseId === expense?._id)
              ?.map?.((media) => (
                <TelegramFileView
                  key={media._id}
                  media={media}
                  description={media.name}
                  canDelete
                  onRefresh={handleRefreshMedias}
                  imageStyle={{
                    height: '300px',
                  }}
                />
              ))}
          </Grid>
        </Show>
      </VStack>
    </Modal>
  );
};
