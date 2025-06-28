import {
  Button,
  ButtonProps,
  CloseButton,
  Dialog,
  Portal,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface ButtonConfirmProps extends ButtonProps {
  heading?: React.ReactNode;
  message: string | React.ReactNode;
  onClick?: () => void;
  onOk: () => void;
  onRunValidation?: () => boolean;
  skipConfirm?: boolean;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ButtonConfirm: React.FC<ButtonConfirmProps> = ({
  heading,
  message,
  onOk,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  skipConfirm = false,
  onClick,
  onRunValidation,
  children,
  ...buttonProps
}) => {

  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    if (onRunValidation && onRunValidation() === false) {
      return;
    }
    onOk();
    setOpen(false)
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setOpen(false)
  };

  const handleOpenClick = (e: any) => {
    e.stopPropagation();
    onClick?.();
    setOpen(true)
  };

  return (
    <>
      {/* Modal de confirmación */}


      <Dialog.Root open={open}>
        <Dialog.Trigger asChild>

          {/* Botón que abre el modal */}
          <Button
            // @ts-ignore
            variant="unstyled"
            padding={0}
            margin={0}
            height="fit-content"
            width="100%"
            {...buttonProps}
            onClick={(e) => {
              if (skipConfirm) {
                onOk();
                return;
              }
              handleOpenClick(e);
            }}
          >
            {children}
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{heading ?? 'Confirmación'}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
              <Text whiteSpace="pre-wrap"> {message}</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline"     onClick={handleCancel}>   {cancelText}</Button>
                </Dialog.ActionTrigger>
                <Button   variant="solid"   onClick={handleConfirm}>     {confirmText}</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm"  onClick={handleCancel} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
