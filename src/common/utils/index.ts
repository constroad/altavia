import { useBreakpointValue } from "@chakra-ui/react";

export const onApiNoMatch = (req: any, res: any) => {
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
