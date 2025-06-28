'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Flex, Grid, GridItem, VStack } from '@chakra-ui/react';
import { toast } from '../Toast';
import { PixCircleIcon } from 'src/common/icons';
import { useMedias } from 'src/common/hooks/useMedias';
import { CopyPaste } from './CopyPaste';
import { MediaType } from 'src/models/media';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';

interface MediaUploaderProps {
  parentId?: string; // tripId, si está creado
  type: MediaType;
  onLocalFiles?: (files: File[]) => void;
  onUploaded?: () => void;
}

export const MediaUploader = ({
  parentId,
  type,
  onLocalFiles,
  onUploaded,
}: MediaUploaderProps) => {
  const [fileList, setFileList] = useState<File[]>([]);

  const {
    onUpload,
    isUploading,
  } = useMedias({
    enabled: false,
  });

  useEffect(() => {
    onLocalFiles?.(fileList);
  }, [fileList]);

  const handlePasteImages = (files: File[]) => {
    setFileList([...fileList, ...files]);
  };

  const handleRemove = (index: number) => {
    const updated = [...fileList];
    updated.splice(index, 1);
    setFileList(updated);
  };

  // useEffect(() => {
  //   if (!parentId) return; // ← Solo sube si estás editando
  
  //   // Subir solo si hay archivos y estás en modo edición
  //   if (fileList.length > 0) {
  //     fileList.forEach((file) => {
  //       onUpload(file, {
  //         resourceId: parentId,
  //         type,
  //         fileName: `Upload_${type}.jpg`,
  //         onSuccess: () => {
  //           onUploaded?.();
  //         },
  //       });
  //     });
  
  //     setFileList([]); // ← Limpia después de subir
  //   }
  // }, [parentId]);
  

  return (
    <VStack spaceY={3} w="100%">
      <CopyPaste
        chat_Id=""
        width="100%"
        height={8}
        title="Copiar y pegar Fotos"
        type={type}
        onPaste={handlePasteImages}
        onSelect={(file) => setFileList((prev) => [...prev, file])}
      />

      {/* <CameraCapture ... /> */}
      {/* TODO: para despues*/}
      {/* <CameraCapture
        isUploading={isUploading}
        onCapture={handleTakePhoto}
        btnTextSend={<><CheckIcon /> Ok</>}
        hiddenMap
      /> */}

      <Grid templateColumns="repeat(5, 1fr)" gap={1} w="100%">
        {fileList.map((file, idx) => (
          <GridItem key={idx} width="50px" height="40px">
            <Box position="relative">
              <Box
                position="absolute"
                top={-3}
                right={-3}
                onClick={() => handleRemove(idx)}
              >
                <IconWrapper icon={PixCircleIcon} color="gray.500" size={35} />
              </Box>
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                style={{ borderRadius: '8px' }}
              />
            </Box>
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
};
