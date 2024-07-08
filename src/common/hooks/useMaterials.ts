import { useEffect, useState } from "react";
import { IMaterialSchema } from "src/models/material";
import { API_ROUTES } from "../consts";
import { useAsync } from "./useAsync";
import axios from "axios";
import { toast } from "src/components";

const fetcher = (path: string) => axios.get(path);
const deleter = (path: string) => axios.delete(path);

export const useMaterials = () => {
  const {
    run: runGetMaterials,
    data: materialResponse,
    isLoading,
    refetch,
  } = useAsync<IMaterialSchema[]>();

  const [controlledMaterials, setControlledMaterials] = useState<IMaterialSchema[]>([])

  const { run: runDeleteMaterial, isLoading: deletingMaterial } = useAsync();

  useEffect(() => {
    runGetMaterials(fetcher(API_ROUTES.material), {
      refetch: () => runGetMaterials(fetcher(API_ROUTES.material)),
      cacheKey: API_ROUTES.material,
      onSuccess: (response) => {
        if (JSON.stringify(controlledMaterials) !== JSON.stringify(response.data)) {          
          setControlledMaterials(response.data)
        }
      }
    });
  }, []);


  const onDeleteMaterial = (id: string, callbask?: () => void) => {
    const material = materialResponse?.data?.find((x) => x._id === id)
    runDeleteMaterial(
      deleter(`${API_ROUTES.material}/${id}`),
      {
        onSuccess: () => {
          toast.success(`Eliminaste el material ${material?.name}`);
          refetch();
          callbask?.()
        },
      }
    );
  };

  const materials = materialResponse?.data ?? []
  const materialsMap = Object.fromEntries(materials.map((x) => [x._id, x]));


  return {
    materials,
    controlledMaterials,
    onUpdateControlledMaterials: setControlledMaterials,
    isLoading,
    refetch,
    onDeleteMaterial,
    deletingMaterial,
    materialsMap
  }
}