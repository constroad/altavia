import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IClientValidationSchema } from 'src/models/client';

interface SearchDispatchProps {
  clientList: IClientValidationSchema[];
  startDate: string;
  endDate: string;
  clientId: string;
  isSearching?: boolean;
  onSearch: (filters: {
    startDate: string;
    endDate: string;
    clientId: string;
  }) => void;
}

export const SearchDispatch = (props: SearchDispatchProps) => {
  const [startDate, setStartDate] = useState(props.startDate);
  const [clientId, setClientId] = useState(props.clientId);
  const [endDate, setEndDate] = useState(props.endDate);

  const onSearch = () => {
    props.onSearch({
      startDate,
      endDate,
      clientId,
    });
  };

  return (
    <Flex width={{base : "100%", sm: "450px"}} gap={1} alignItems="end" justifyContent="space-between">
      <FormControl>
        <FormLabel mb="6px" fontSize={{ base: 12 }}>
          Desde:
        </FormLabel>
        <Input
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          paddingInlineEnd={1}
          paddingInlineStart={1}
          fontSize={{ base: 12 }}
          height="32px"
          type="date"
          width="100px"
        />
      </FormControl>
      <FormControl>
        <FormLabel mb="6px" fontSize={{ base: 12 }}>
          Hasta
        </FormLabel>
        <Input
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          paddingInlineEnd={1}
          paddingInlineStart={1}
          fontSize={{ base: 12 }}
          height="32px"
          type="date"
          width="100px"
        />
      </FormControl>
      <Flex flexDir="column" fontSize="inherit">
        <Text fontSize={{ base: 12 }} mb="6px">
          Cliente:
        </Text>
        <Select
          defaultValue=""
          size="sm"
          width={{ base: '90px', md: '150px' }}
          onChange={(e) => setClientId(e.target.value)}
          fontSize={12}
          value={clientId}
        >
          <option value="">Todos</option>
          {props.clientList.map((client) => (
            <option key={`filter-${client._id}`} value={client._id}>
              {client.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Button
        width="180px"
        autoFocus
        onClick={onSearch}
        size="sm"
        isLoading={props.isSearching}
      >
        Buscar
      </Button>
    </Flex>
  );
};
