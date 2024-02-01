import { useBreakpointValue } from "@chakra-ui/react";

export const useScreenSize = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDesktop = useBreakpointValue({ base: false, xl: true });
  return {
     isMobile,
     isDesktop
  }
};
