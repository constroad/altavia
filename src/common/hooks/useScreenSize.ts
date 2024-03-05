import { useBreakpointValue } from "@chakra-ui/react";

export const useScreenSize = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDesktop = useBreakpointValue({ base: false, md: true });
  return {
     isMobile,
     isDesktop
  }
};
