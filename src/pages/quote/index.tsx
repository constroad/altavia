import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { toast } from 'src/components';
import { IQuoteValidationSchema } from 'src/models/quote';

interface QuotesProps {}

const fetcher = (path: string) => axios.get(path);
const deleteQuote = (path: string) => axios.delete(path);

const Quotes = (props: QuotesProps) => {
  const router = useRouter();

  const { run, isLoading, data, refetch } =
    useAsync<IQuoteValidationSchema[]>();
  const { run: runDelete, isLoading: isDeleting } = useAsync();

  useEffect(() => {
    run(fetcher(API_ROUTES.quote), {
      refetch: () => run(fetcher(API_ROUTES.quote)),
    });
  }, []);

  
  // handlers
  const handleOnNew = () => {
    router.push(APP_ROUTES.quoteNew);
  };
  const handleOnDelete = (id: string) => {
    runDelete(deleteQuote(`${API_ROUTES.quote}?id=${id}`), {
      onSuccess: () => {
        toast.success(`Cotizacion ${id} fue eliminada`)
        refetch()
      },
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  const quotes = data?.data ?? [];

  return (
    <Box>
      List of quotes:
      {quotes.map((item) => {
        return (
          <Flex key={item._id}>
            <Text>Cliente:{item.clientId}</Text>
            <Button
              isLoading={isDeleting}
              onClick={() => handleOnDelete(item._id!)}
            >
              Delete
            </Button>
          </Flex>
        );
      })}
      <Button onClick={handleOnNew}>New</Button>
    </Box>
  );
};

export default Quotes;
