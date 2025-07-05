'use client'

import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react"

interface IDrawer {
  open: boolean;
  onChangeOpen?: (e: any) => void;
  title?: string;
  children?: React.ReactNode;
  openButton?: boolean;
}

export const DrawerComponent = (props: IDrawer) => {
  return (
    <Drawer.Root open={props.open} onOpenChange={props.onChangeOpen} >
      {props.openButton && (
        <Drawer.Trigger asChild>
          <Button variant="outline" size="sm">
            Open Drawer
          </Button>
        </Drawer.Trigger>
      )}
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxWidth={{ base: '100vw', md: '400px' }}>
            <Drawer.Header>
              <Drawer.Title>
                {props.title ? props.title : 'Drawer Title'}
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {props.children}
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
