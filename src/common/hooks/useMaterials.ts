import { useState } from "react";
import { IMaterialSchema } from "src/models/material";
import { API_ROUTES } from "../consts";
import { useAsync } from "./useAsync";
import axios from "axios";
import { toast } from "src/components";
import { useFetch } from "./useFetch";

const deleter = (path: string) => axios.delete(path);

export const useMaterials = () => {
  const [ controlledMaterials, setControlledMaterials ] = useState<IMaterialSchema[]>([])

  const { run: runDeleteMaterial, isLoading: deletingMaterial } = useAsync();
  const { data: materialResponse, isLoading, refetch } = useFetch<IMaterialSchema[]>(API_ROUTES.material, {
    onSuccess:(response) => {
      setControlledMaterials(response)
    }
  })

  const onDeleteMaterial = (id: string, callbask?: () => void) => {
    const material = materialResponse?.find((x) => x._id === id)
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

  const materials = materialResponse ?? []
  const materialsMap = Object.fromEntries(materials.map((x) => [ x._id, x ]));


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