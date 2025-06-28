'use client';

import { useState } from 'react';
import { Input, Button, VStack, Text, Box } from '@chakra-ui/react';
import { MediaUploader } from '../upload/MediaUploader';
import { Modal } from '../modal';

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    expense: { description: string; amount: number },
    files: File[]
  ) => void;
}

export const ExpenseModal = ({ open, onClose, onSave }: ExpenseModalProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  console.log('modal - uploadedFiles', uploadedFiles)

  const handleSave = () => {
    if (!description || !amount || uploadedFiles.length === 0) return;
  
    onSave(
      { description, amount: Number(amount) },
      uploadedFiles
    );
  
    // reset
    setDescription('');
    setAmount('');
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      heading="Agregar Gasto"
      footer={
        <Button onClick={handleSave} colorScheme="blue" size="sm">
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

        <MediaUploader
          type="TRIP_EXPENSE"
          onLocalFiles={(files) => setUploadedFiles(files)}
        />
      </VStack>
    </Modal>
  );
};
