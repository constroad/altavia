'use client';

import { Button, ButtonProps, Popover, Portal } from '@chakra-ui/react';
import { PropsWithChildren, useState } from 'react';

interface PopOverProps extends PropsWithChildren {
  buttonProps?: ButtonProps;
  content: React.ReactNode;
  title?: React.ReactNode;
}
export const PopOver = (props: PopOverProps) => {
  const { buttonProps } = props;
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Popover.Trigger asChild>
        <Button p={0} m={0} variant="plain" width="fit-content" height="fit-content" {...buttonProps}>
          {props.children}
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              {props.title && (
                <Popover.Title fontWeight="medium">{props.title}</Popover.Title>
              )}
              {props.content}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
