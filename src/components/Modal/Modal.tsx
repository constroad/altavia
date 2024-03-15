import React, { PropsWithChildren } from 'react'
import {
  Button,
  Flex,
  Modal as ModalChakra,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

export type ModalProps = PropsWithChildren & {
  heading?: React.ReactNode
  footer?: React.ReactNode
  isOpen: boolean
  width?: string
  onClose?: () => void
  hideCancelButton?: boolean
}

export const Modal = (props: ModalProps) => {
  const { isOpen, onClose, hideCancelButton, heading, footer, children } = props
  const showFooter = footer ?? !hideCancelButton
  const modalProps = {
    isCentered: true,
    isOpen,
    ...(onClose ? { onClose } : { onClose: () => {} }),
  }

  return (
    <ModalChakra {...modalProps}>
      <ModalOverlay
        bg="rgba(17,64,68,0.7)"
        sx={{ backdropFilter: 'blur(4px)' }}
      />

      <ModalContent minW={{ base: '100%', md: props.width ?? 'xl' }} py={2} className="modal-content">
        {heading && <ModalHeader as="h4" px='20px' py='12px' width='95%' fontSize={{ base: 16 }} >{heading}</ModalHeader>}

        {onClose && (
          <ModalCloseButton
            zIndex={10}
            transform="translate(-7px, 7px)"
            aria-label="Close Modal"
            _hover={{ bg: 'transparent' }}
          />
        )}

        <ModalBody
          {...(showFooter ? {} : { paddingBottom: 6 })}
          maxH="80vh"
          overflow="auto"
        >
          {children}
        </ModalBody>

        {showFooter && (
          <ModalFooter as={Flex} gap={2} justifyContent="space-between">
            {!hideCancelButton && onClose && (
              <Button variant="outline" colorScheme="gray" onClick={onClose} size='sm'>
                Cancel
              </Button>
            )}

            <Flex gap={2}>{footer}</Flex>
          </ModalFooter>
        )}
      </ModalContent>
    </ModalChakra>
  )
}
