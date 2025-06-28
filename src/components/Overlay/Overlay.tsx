import { PropsWithChildren } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

type OverlayProps = PropsWithChildren & {
  loading?: boolean;
  isOpen?: boolean;
  actions?: React.ReactNode;
};

const OverlayWrapper = (props: PropsWithChildren) => {
  return (
    <Box>
      <Box
        position="absolute"
        width="100%"
        height="100%"
        zIndex={5}
        bg="rgba(17,64,68,0.7)"
        style={{ backdropFilter: 'blur(2px)' }}
      >
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Flex>{props.children}</Flex>
        </Flex>
      </Box>
    </Box>
  );
};
export const Overlay = (props: OverlayProps) => {
  const { loading, isOpen, actions } = props;
  if (loading) {
    return (
      <Box position="relative" width="inherit" height="inherit">
        <OverlayWrapper>
          <Spinner color="white" />
        </OverlayWrapper>
        {props.children}
      </Box>
    );
  }
  if (isOpen) {
    return (
      <Box position="relative" width="inherit" height="inherit">
        <OverlayWrapper>
          {actions || (
            <Box color="white" fontSize="10px" width="100%" height="100%">
              no actions
            </Box>
          )}
        </OverlayWrapper>
        {props.children}
      </Box>
    );
  }
  return <>{props.children}</>;
};

type VideoOverlayProps = PropsWithChildren & {
  onClick?: () => void;
  show?: boolean;
};
export const VideoOverlay = (props: VideoOverlayProps) => {
  const { show = true } = props;
  if (show) {
    return (
      <Box
        position="relative"
        width="inherit"
        height="inherit"
        overflow="hidden"
      >
        {props.children}
        <Box
          onClick={props.onClick}
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          width="100%"
          height="100%"
          zIndex={2}
          bg="rgba(17,64,68,0.2)"
        ></Box>
      </Box>
    );
  }
  return <Box>{props.children}</Box>;
};
