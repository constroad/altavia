import { Box } from '@chakra-ui/react';
import { SortColumnStatus, TableColumn } from './TableTypes';
import { SortDownIcon, SortUpIcon } from 'src/common/icons';
import { useEffect, useState } from 'react';

interface WithSortProps {
  isLoading?: boolean;
  col: TableColumn;
  reset?: boolean;
  onClick: (status: SortColumnStatus) => any;
}

export const WithSort = (props: WithSortProps) => {
  const [sortStatus, setStatus] = useState<SortColumnStatus>('descending');

  useEffect(() => {
    if (props.reset) {
      setStatus('none');
    }
  }, [props.reset]);

  const onSortColumn = () => {
    let newStatus: SortColumnStatus = 'descending';
    if (sortStatus === 'descending') {
      newStatus = 'ascending';
    }
    if (sortStatus === 'ascending') {
      newStatus = 'descending';
    }
    setStatus(newStatus);
    props.onClick(newStatus);
  };

  if (!props.col.sorter || props.isLoading) {
    return null;
  }

  const Icon = {
    none: <SortUpIcon />,
    ascending: <SortUpIcon />,
    descending: <SortDownIcon />,
  };

  return <Box cursor="pointer" onClick={onSortColumn}>{Icon[sortStatus]}</Box>;
};
