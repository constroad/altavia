'use client';
import { Box, Flex, Input, Spinner } from '@chakra-ui/react';
import React, { useRef, MouseEvent, useEffect } from 'react';
import { MediaType } from 'src/models/media';
import { useMedias } from 'src/common/hooks/useMedias';
import { UploadIcon } from 'src/common/icons';
import { toast } from '../Toast';
import { TelegramMedia } from 'src/common/hooks/useTelegram';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';

type CopyPasteProps = {
  chat_Id?: string;
  title?: string;
  isDisabled?: boolean;
  isUploading?: boolean;
  fileName?: string;
  type: MediaType;
  resourceId?: string;
  width?: string;
  metadata?: any;
  height?: string | number;
  onSuccess?: (fileTelegram: TelegramMedia) => void;  
  icon?: JSX.Element;
  onPaste?: (files: File[]) => void;
  onSelect?: (file: File) => void;
};
export const CopyPaste = (props: CopyPasteProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { type, resourceId, metadata, onSuccess, fileName } = props;

  const { onUpload, isUploading, onPasteImages } = useMedias({
    chat_id: props.chat_Id,
    enabled: false,
    type,
    resourceId,
    onPasteMetadata: {
      fileName: fileName ?? `${type}_upload.jpg`,
      type,
      metadata,
      onSuccess: props.onSuccess,
    },
  });
  useEffect(() => {
    document.addEventListener('paste', onPaste);

    return () => {
      document.removeEventListener('paste', onPaste);
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      handleUpload(selectedFile);
    }
  };

  const handleSelectFileClick = (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (props.isDisabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (file: File) => {
    if (isUploading) {
      return;
    }
    if (!file) {
      toast.warning('No file selected');
      return;
    }
    
    if (props.onSelect) {
      props.onSelect(file);
      return;
    }

    onUpload(file, {
      type,
      fileName: file.name,
      metadata,
      onSuccess: (response) => {
        onSuccess?.({...response, file})
      },
    });
  };

  function onPaste(event: ClipboardEvent) {
    if (!props.onPaste) {
      onPasteImages(event);
      return;
    }

    const clipboardItems = event.clipboardData?.items ?? [];
    const files: File[] = [];
    for (let i = 0; i < clipboardItems.length; i++) {
      if (clipboardItems[i].type.indexOf('image') === 0) {
        const blob = clipboardItems[i].getAsFile();
        if (!blob) continue;
        files.push(blob);
      }
    }
    props.onPaste?.(files);
  }

  return (
    <Box width={props.width ?? '100%'}>
      <Input
        ref={fileInputRef}
        style={{ display: 'none' }}
        size="xs"
        type="file"
        onChange={handleFileChange}
        mb={4}
      />

      <Flex
        minH={props.height ?? 5}
        onClick={handleSelectFileClick}
        border="dashed 2px gray"
        justifyContent="center"
        gap={2}
        cursor="pointer"
      >
        {(props.isUploading || isUploading) && <Spinner size="sm" />}
        <Flex alignItems="center" justifyContent="center" gap={1} 
        color={props.isDisabled ? 'gray.300' : 'inherit'}
        
        >
          {props.icon || <IconWrapper icon={UploadIcon} fontSize={20} />}
          {props.title ?? "Copiar y pegar archivo"}
        </Flex>
      </Flex>
    </Box>
  );
};
