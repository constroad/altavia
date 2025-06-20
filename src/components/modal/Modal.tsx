// components/ui/modal.tsx
'use client'

import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '../ui/dialog'
import { Button } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { CloseIcon } from 'src/common/icons'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  heading?: string
  children?: ReactNode
  footer?: ReactNode
  hideCancelButton?: boolean
}

export const Modal = ({
  isOpen,
  onClose,
  heading,
  children,
  footer,
  hideCancelButton = false,
}: ModalProps) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={({ open }) => { if (!open) onClose(); }}>
      <DialogContent>
        {heading && <DialogHeader fontWeight={600}>{heading}</DialogHeader>}

        <DialogBody>{children}</DialogBody>

        {(footer || !hideCancelButton) && (
          <DialogFooter gap={2}>
            {!hideCancelButton && (
              <DialogCloseTrigger asChild>
                <CloseIcon color='red' fontSize={40} fontWeight={800}/>
              </DialogCloseTrigger>
            )}
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  )
}
