import { v4 as uuidv4 } from 'uuid';
import { ServiceType } from "../services";

export type textSrvc = {
  id: string,
  value: string
}

export type ServiceQuoteNote = {
  title?: string;
  texts: {
    id: string,
    value: string
  }[];
}

export type ServiceQuoteType = {
  _id?: string;
  clientId: string;
  nro: number;
  date: string;
  title?: string;
  items: ServiceType[];
  notes: ServiceQuoteNote[];
  subTotal: number;
  igv: number;
  total: number;
}

export type ServiceQuotePDFType = {
  companyName: string;
  nroQuote: string;
  ruc: string;
  date: string;
  notes?: ServiceQuoteNote[];
  services: ServiceType[];
  addIGV: boolean;
}

export const initialServiceQuote: ServiceQuoteType = {
  clientId: '',
  nro: 0,
  date: '',
  items: [],
  notes: [
    {
      title: 'payment method',
      texts: [
        {
          id: uuidv4(),
          value: 'la forma de pago será el 80% antes de iniciar los procesos constructivos y el 20% al culminar el pavimentado.',
        },
        {
          id: uuidv4(),
          value: 'los p.u. del presupuesto están sujetos a variación por el alza de los materiales, mano de obra y costo directo a la producción de la mezcla asfáltica.',
        },
        {
          id: uuidv4(),
          value: 'no interviene pago a sindicato, gremios y seguridad en la zona.',
        },
        {
          id: uuidv4(),
          value: 'validez de la oferta: siete (7) días.',
        },
        {
          id: uuidv4(),
          value: 'metrados a ser verificados en obra.',
        },
      ]
    },
    {
      title: 'work team',
      texts: [
        {
          id: uuidv4(),
          value: '01 ing. de obra.',
        },
        {
          id: uuidv4(),
          value: '01 op. fresadora',
        },
        {
          id: uuidv4(),
          value: '01.op. de minicargador.',
        },
        {
          id: uuidv4(),
          value: '01 op. de esparcidora.',
        },
        {
          id: uuidv4(),
          value: '01 op. rodillo tandem.',
        },
        {
          id: uuidv4(),
          value: '01 op. rodillo neumático.',
        },
        {
          id: uuidv4(),
          value: '10 op. volquete.',
        },
        {
          id: uuidv4(),
          value: '01 planchero.',
        },
        {
          id: uuidv4(),
          value: '07 rastrilleros.',
        },
        {
          id: uuidv4(),
          value: '03 ayudantes.',
        },
      ]
    },
    {
      title: 'note',
      texts: [
        {
          id: uuidv4(),
          value: 'EL AVANCE PROMEDIO DE LOS TRABAJOS DE ASFALTADO SON DE 3,500M2/DÍA',
        },
        {
          id: uuidv4(),
          value: 'SE CONSIDERA TRABAJAR CON UNA CUADRILLA DE TRABAJADORES DEBIDAMENTE CAPACITADOS.',
        },
        {
          id: uuidv4(),
          value: 'EL TRABAJO TENDRÁ 07 DÍAS DE EJECUCIÓN.'
        },
      ]
    },
    {
      title: 'equipment and tools',
      texts: [
        {
          id: uuidv4(),
          value: '01 FRESADORA MARCA WIRTGEN, MODELO W2000.',
        },
        {
          id: uuidv4(),
          value: '01 COMPRESORA DE AIRE MARCA SAIRCOM, MODELO SKK 185.',
        },
        {
          id: uuidv4(),
          value: '01 MINICARGADOR MARCA CATERPILLAR, MODELO BP15B / BARREDORA.',
        },
        {
          id: uuidv4(),
          value: '01 CAMIÓN IMPRIMADOR MARCA HINO, MODELO 716.',
        },
        {
          id: uuidv4(),
          value: '01 ESPARCIDORA MARCA BLAW-KNOX, MODELO PF-172.',
        },
        {
          id: uuidv4(),
          value: '01 RODILLO TÁNDEM MARCA HYPAC, MODELO 778B.',
        },
        {
          id: uuidv4(),
          value: '01 RODILLO NEUMÁTICO MARCA WATANABE, MODELO W15 WD/0101.',
        },
        {
          id: uuidv4(),
          value: '10 VOLQUETES MARCA MERCEDES, MODELO BENZ ACTROS'
        },
      ]
    },
    {
      title: 'the work to be done contemplates',
      texts: [
        {
          id: uuidv4(),
          value: 'PÓLIZA SCTR.',
        },
        {
          id: uuidv4(),
          value: 'CERTIFICADOS DE OPERATIVIDAD DE MAQUINARIAS Y EQUIPOS.'
        },
      ]
    },
    {
      title: 'proposal includes',
      texts: [
        {
          id: uuidv4(),
          value: 'CERTIFICADO MARSHALL.',
        },
        {
          id: uuidv4(),
          value: 'CERTIFICADO DE LAVADO ASFÁLTICO.',
        },
        {
          id: uuidv4(),
          value: 'DISEÑO DE MEZCLA.',
        },
        {
          id: uuidv4(),
          value: 'CARTA DE GARANTÍA POR 4 AÑOS.'
        },
      ]
    }
  ],
  subTotal: 480,
  igv: 86.4,
  total: 566.4,
}

export const newServiceQuote: ServiceType = {
  description: '',
  alias: '',
  phase: '',
  unit: '',
  inches: 0,
  flete: 0,
  quantity: 1,
  unitPrice: 1,
  total: 1
}

export const comparePhase = (a: ServiceType, b: ServiceType): number => {
  const order: { [key: string]: number } = {
      'OBRAS PRELIMINARES': 1,
      'MOVIMIENTO DE TIERRA': 2,
      'PAVIMENTACION': 3
  };

  const phaseA = a.phase || '';
  const phaseB = b.phase || '';

  if (order[phaseA] < order[phaseB]) {
      return -1;
  }
  if (order[phaseA] > order[phaseB]) {
      return 1;
  }
  return 0;
}
