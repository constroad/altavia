'use client';

import { PortalLayout, toast } from '@/components';
import {
  Box,
  Button,
  Flex,
  Link,
  ListItem,
  Spinner,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface DownloadsPageProps {
  files: string[];
}

const Page = () => {
  const clipboard = useClipboard({
    value: `
  RJZ Constructores (Altavía Perú) 
  RUC . 20612003905
  MARCA . FREIGHTLINER
  PLACAS . B7B755 / B1O998 
  CONF .VEH . T3 S3
  CERT . INSCRIPCIÓN 
  TRACTO . 15M25030411E
  CARRETA . 15M25030409E
  CONDUCTOR . ADRIAN ZAMORA CHAVEZ 
  BREVETE. Y07679870 
  `,
  });

  const [files, setFiles] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/assets');
      const data = await res.json();
      setFiles(data);
    };
    if (files === null) {
      fetchFiles();
    }
  }, []);

  if (!files) return <Spinner />;

  return (
    <PortalLayout noPaddingTop>
      <Stack
        px={{ base: 8, md: 16 }}
        py={{ base: 8, md: 16 }}
        gap={2}
        fontSize={12}
      >
        <Flex alignItems="center" justifyContent="center">
          <Text fontWeight={600} fontSize={{ base: 20, md: 26 }}>
            Reporte de Unidad
          </Text>
        </Flex>
        <Stack gap={2}>
          <Box>
            <Box>
              <Text fontWeight={600}>- RJZ Constructores (Altavía Perú) </Text>
            </Box>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - RUC:{' '}
              </Text>{' '}
              <Text>20612003905</Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - MARCA:{' '}
              </Text>
              <Text>FREIGHTLINER</Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - PLACAS:{' '}
              </Text>
              <Text>B7B755 / B1O998 </Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - CONF .VEH .{' '}
              </Text>
              <Text>T3 S3</Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - CERT .{' '}
              </Text>
              <Text>INSCRIPCIÓN </Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - TRACTO .{' '}
              </Text>
              <Text>15M25030411E</Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - CARRETA
              </Text>
              <Text>15M25030409E</Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - CONDUCTOR .{' '}
              </Text>
              <Text>ADRIAN ZAMORA CHAVEZ</Text>
            </Flex>
            <Flex>
              <Text width="100px" fontWeight={500}>
                - BREVETE.{' '}
              </Text>
              <Text>Y07679870</Text>
            </Flex>
          </Box>

          <Button
            width="fit-content"
            variant="surface"
            size="xs"
            onClick={() => {
              clipboard.copy()
              toast.success("informacion de unidad copiada")
            }}
          >
            {clipboard.copied ? 'Copiado' : 'Copiar información'}
          </Button>

          <Flex flexDir="column" gap={.5}>
            {files.map((file) => (
              <Box key={file}>
                <Link
                  href={`/presentation/${file}`}
                  download
                  variant="underline"
                  color="blue.600"
                >
                  Descargar {file}
                </Link>
              </Box>
            ))}
          </Flex>
        </Stack>
      </Stack>
    </PortalLayout>
  );
};

export default Page;
