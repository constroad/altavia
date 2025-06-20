'use client';
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Input,
  Show,
  Text,
} from '@chakra-ui/react';
import React, { useRef, MouseEvent, useEffect } from 'react';
import { MediaType } from 'src/models/media';
import { useMedias } from 'src/common/hooks/useMedias';
import { toast } from '../Toast';
import { UploadIcon } from 'src/common/icons';
import { Tooltip } from '../ui/tooltip';

type UploadButtonProps = {
  title?: string;
  variant?: ButtonProps['variant'];
  tooltip?: string;
  isDisabled?: boolean;
  fileName?: string;
  type: MediaType;
  resourceId?: string;
  width?: string;
  metadata?: any;
  onSuccess?: () => void;
  enableOnPaste?: boolean;
  icon?: JSX.Element;
  isHidden?: boolean;
};

export const UploadButton = (props: UploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    type,
    resourceId,
    metadata,
    onSuccess,
    fileName,
    enableOnPaste = false,
    variant = 'outline',
  } = props;

  const { onUpload, isUploading, onPasteImages } = useMedias({
    enabled: false,
    type,
    resourceId,
    onPasteMetadata: {
      fileName: fileName ?? `${type}_upload`,
      type,
      metadata,
      onSuccess: props.onSuccess,
    },
  });

  useEffect(() => {
    if (enableOnPaste) {
      document.addEventListener('paste', onPasteImages);
    }

    return () => {
      if (enableOnPaste) {
        document.removeEventListener('paste', onPasteImages);
      }
    };
  }, [enableOnPaste]);

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
    onUpload(file, {
      type,
      fileName: file.name,
      metadata,
      onSuccess,
    });
  };

  return (
    <Box width={props.width} display={`${props.isHidden ? 'none' : 'block'}`}>
      <Input
        ref={fileInputRef}
        style={{ display: 'none' }}
        size="xs"
        type="file"
        onChange={handleFileChange}
        mb={4}
      />

      <Tooltip
        content={props.tooltip}
        disabled={props.tooltip === undefined}
      >
        <Button
          disabled={props.isDisabled}
          loading={isUploading}
          variant={variant ?? 'solid'}          
          gap={1}
          size={{ base: 'sm', md: 'xs' }}
          width="100%"
          onClick={handleSelectFileClick}
          as={Flex}
          justifyContent="space-between"
          cursor="pointer"
        >
          <Text>{props.title ?? 'Subir archivo'}</Text>
          <Show when={props.icon}>{props.icon}</Show>
          <Show when={!props.icon}>
            {/* @ts-ignore */}
            <UploadIcon size={20} />
          </Show>
        </Button>
      </Tooltip>
    </Box>
  );
};
