export type ProdInfoType = {
  clientName: string;
  days: number;
  m3Daily: number;
  m3Produced: number;
  metrado: number;
  thickness: number;
  waste: number;
}

export const initialProductionInfo: ProdInfoType = {
  clientName: '',
  metrado: 1000,
  thickness: 0.065,
  waste: 0.10,
  m3Produced: 65,
  days: 1,
  m3Daily: 65,
}

export const asphaltRowsArr = [
  { id: 1, 'Insumo': 'Arena Lurin', 'Dosis': 0.36, 'M3/GLS': 0, 'Precio': 52, 'Total': 0 },
  { id: 2, 'Insumo': 'Arena Telkus', 'Dosis': 0.24, 'M3/GLS': 0, 'Precio': 38, 'Total': 0 },
  { id: 3, 'Insumo': 'Piedra', 'Dosis': 0.40, 'M3/GLS': 0, 'Precio': 45, 'Total': 0 },
  { id: 4, 'Insumo': 'Petroleo', 'Dosis': 0.40, 'M3/GLS': 0, 'Precio': 15.50, 'Total': 0 },
  { id: 5, 'Insumo': 'PEN', 'Dosis': 24, 'M3/GLS': 0, 'Precio': 13.75, 'Total': 0 },
  { id: 6, 'Insumo': 'Gasohol', 'Dosis': 2, 'M3/GLS': 0, 'Precio': 8.32, 'Total': 0 },
  { id: 7, 'Insumo': 'Gas', 'Dosis': 0.01, 'M3/GLS': 0, 'Precio': 5, 'Total': 0 },
  { id: 8, 'Insumo': 'Alq. Planta', 'Dosis': 1, 'M3/GLS': 0, 'Precio': 30, 'Total': 0 },
]

export const serviceRowsArr = [
  { id: 1, 'Item': 'Camabaja', 'Cantidad': 1, 'Precio': 2000, 'Total': 0 },
  { id: 2, 'Item': 'Maquinaria', 'Cantidad': 1, 'Precio': 3400, 'Total': 0 },
  { id: 3, 'Item': 'Petroleo Maq.', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
  { id: 4, 'Item': 'Operadores', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
  { id: 5, 'Item': 'Transporte', 'Cantidad': 34.5, 'Precio': 30, 'Total': 0 },
  { id: 6, 'Item': 'Personal', 'Cantidad': 1, 'Precio': 2500, 'Total': 0 },
  { id: 7, 'Item': 'Caja', 'Cantidad': 1, 'Precio': 500, 'Total': 0 },
  { id: 8, 'Item': 'EPP', 'Cantidad': 1, 'Precio': 150, 'Total': 0 },
  { id: 9, 'Item': 'Sindicato', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
  { id: 10, 'Item': 'Laboratorio', 'Cantidad': 1, 'Precio': 400, 'Total': 0 },
  { id: 11, 'Item': 'Samuel', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
  { id: 12, 'Item': 'Viaticos', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
]

export const imprimacionRowsArr = [
  { id: 1, 'Item': 'MC-30', 'Cantidad': 0, 'Dosis': 0.2, 'Precio': 15, 'Total': 0 },
  { id: 2, 'Item': 'Camion Imprimador', 'Cantidad': 1, 'Dosis': 0, 'Precio': 1500, 'Total': 0 },
  { id: 3, 'Item': 'Maestro', 'Cantidad': 1, 'Dosis': 0, 'Precio': 300, 'Total': 0 },
  { id: 4, 'Item': 'Gas', 'Cantidad': 1, 'Dosis': 0, 'Precio': 42, 'Total': 0 },
]

export const thicknessRows = [
  { id: 1, 'Pulgadas': 1, 'Centimetros': 0.035 },
  { id: 2, 'Pulgadas': 1.5, 'Centimetros': 0.048 },
  { id: 3, 'Pulgadas': 2, 'Centimetros': 0.065 },
  { id: 4, 'Pulgadas': 2.5, 'Centimetros': 0.083 },
  { id: 5, 'Pulgadas': 3, 'Centimetros': 0.095 },
]
