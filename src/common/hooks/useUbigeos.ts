// src/hooks/useUbigeos.ts

import { useEffect, useState } from "react";

export const getPeruRegions = (): string[] => {
  return [
    "Amazonas",
    "Áncash",
    "Apurímac",
    "Arequipa",
    "Ayacucho",
    "Cajamarca",
    "Callao",
    "Cusco",
    "Huancavelica",
    "Huánuco",
    "Ica",
    "Junín",
    "La Libertad",
    "Lambayeque",
    "Lima",
    "Loreto",
    "Madre de Dios",
    "Moquegua",
    "Pasco",
    "Piura",
    "Puno",
    "San Martín",
    "Tacna",
    "Tumbes",
    "Ucayali"
  ];
};


type Ubigeo = {
  ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
};

export const useUbigeos = () => {

  const [data, setData] = useState<Ubigeo[]>([])

  // useEffect(() => {
  //   const getUbigeo = async () => {
  //     try {
  //       const res = await fetch('https://free.e-api.net.pe/ubigeos.json')
  //       if (!res.ok) throw new Error('Failed to fetch ubigeos');
  //       return res.json();
  //     } catch (error) {
        
  //     }
  //   }
  //   getUbigeo()
    
  // }, [])

  const regions = getPeruRegions()
  

  return {
    regions    
  };
};

