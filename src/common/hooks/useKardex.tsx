import axios from 'axios';
import { useEffect, useState } from 'react';
import { GETAllKardex, IKardexSchema } from 'src/models/kardex';
import { API_ROUTES } from '../consts';
import { useAsync } from './useAsync';
import { toast } from 'src/components';
import { IMaterialSchema } from 'src/models/material';

const fetcher = (path: string) => axios.get(path);
const deleter = (path: string) => axios.delete(path);

type IKardexHook = {
  month: number;
  year: number;
  materialId?: string;
};

const MonthNames: Record<number, string> = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Setiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
}

export const useKardex = (props: IKardexHook) => {
  const { month, year, materialId } = props;
  const [initialValues, setInitialValues] = useState({ quantity: 0, value: 0 });

  // API
  const {
    run: runGetKardex,
    data: kardexResponse,
    isLoading,
    refetch: refetchKardex,
  } = useAsync<GETAllKardex>();
  const { run: runDeleteKardex, isLoading: deletingKardex } = useAsync();

  useEffect(() => {
    onSearch();
  }, []);

  const onDeleteKardex = async (id: string, callback?: () => void) => {
    runDeleteKardex(deleter(`${API_ROUTES.kardex}/${id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste el kardex`);
        refetchKardex();
        callback?.();
      },
    });
  };

  const computeBalance = (kardex: IKardexSchema[]) => {
    let balanceQuantity = initialValues.quantity;
    let balanceValue = initialValues.value;

    return kardex.map((entry) => {
      if (entry.type === 'Ingreso') {
        balanceQuantity += entry.quantity;
        balanceValue += entry.value ?? 0;
      } else if (entry.type === 'Salida') {
        balanceQuantity -= entry.quantity;
        balanceValue -= entry.value ?? 0;
      }

      return {
        ...entry,
        balanceQuantity,
        balanceValue,
        unitCost: balanceQuantity !== 0 ? balanceValue / balanceQuantity : 0,
      };
    });
  };

  const onSearch = () => {
    let path = `${API_ROUTES.kardex}?month=${month}&year=${year}`;
    if (materialId) {
      path = `${path}&materialId=${materialId}`
    }
    runGetKardex(fetcher(path), {
      refetch: () => runGetKardex(fetcher(path)),
      // cacheKey: API_ROUTES.kardex,
      onSuccess: (response) => {
        const { quantity, value } = response.data.initialValues ?? {};
        setInitialValues({ quantity: quantity ?? 0, value: value ?? 0 });
      },
    });
  };

  const kardexWithBalance = computeBalance(kardexResponse?.data?.kardex ?? []);

  return {
    kardex: kardexResponse?.data?.kardex ?? [],
    isLoading,
    initialValues,
    kardexWithBalance,
    onDeleteKardex,
    refetchKardex,
    deletingKardex,
    onSearch,
    monthList: Array.from({ length: 12 }, (_, i) => i + 1).map((x) => ({
      value: x,
      name: MonthNames[x]
    })),
    yearList: Array.from({length: 10}, (_, i) => (new Date().getFullYear()) - i)
  };
};
