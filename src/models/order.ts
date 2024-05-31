import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

export enum OrderStatus {
   pending= 'pending',
   completed= 'completed',
   deleted= 'deleted',
   rejected= 'rejected'
}

// Schema validation
export const orderValidationSchema = z.object({
  _id: z.string().optional(),
  clienteId: z.string().optional(),
  cliente: z.string().optional(),
  cotizacionId: z.string().optional(),
  tipoMAC: z.string(),
  fechaProgramacion: z.string(),
  notas: z.string().optional(),
  obra: z.string().optional(),
  certificados: z.array(z.object({
    _id: z.string(),
    url: z.string().optional(),
    fecha: z.string(),
    obra: z.string(),
    empresa: z.string(),
  })),
  consumos: z.object({
    galonesPEN: z.number(),
    galonesIFO: z.number(),
    galonesPetroleo: z.number(),
    m3Arena: z.number(),
    m3Piedra: z.number(),
  }).optional(),
  precioCubo: z.number(),
  cantidadCubos: z.number(),
  totalPedido: z.number(),
  montoAdelanto: z.number().optional(),
  montoPorCobrar: z.number().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export type IOrderValidationSchema = z.infer<typeof orderValidationSchema>


// DB model + schema
interface ICertificado {
  _id: string;
  fecha: string;
  url?: string;
  obra: string;
  empresa: string;
}

interface IConsumos {
  galonesPEN: number;
  galonesIFO: number;
  galonesPetroleo: number;
  m3Arena: number;
  m3Piedra: number;
}

export interface OrderModel extends Document {
  clienteId?: string;
  cliente?: string;
  cotizacionId?: string;
  tipoMAC: string;
  fechaProgramacion: Date;
  obra?: string;
  notas?: string;
  certificados?: ICertificado[];
  consumos?: IConsumos;
  cantidadCubos: number;
  precioCubo: number;
  totalPedido: number;
  montoAdelanto?: number;
  montoPorCobrar?: number;
  status?: string;
}

const CertificadoSchema = new Schema<ICertificado>({
  _id: { type: String, required: true },
  url: { type: String, required: false },
  fecha: { type: String, required: true },
  obra: { type: String, required: true },
  empresa: { type: String, required: true },
});

const ConsumosSchema = new Schema<IConsumos>({
  galonesPEN: { type: Number, required: true },
  galonesIFO: { type: Number, required: true },
  galonesPetroleo: { type: Number, required: true },
  m3Arena: { type: Number, required: true },
  m3Piedra: { type: Number, required: true },
});

let Order: Model<OrderModel>;
try {
  Order = mongoose.model('Order') as Model<OrderModel>;
} catch (e) {
  
  const orderDBSchema = new Schema<OrderModel>({
    clienteId: { type: String, required: false },
    cliente: { type: String, required: false },
    cotizacionId: { type: String, required: false },
    tipoMAC: { type: String, required: true },
    fechaProgramacion: { type: Date, required: true },
    notas: { type: String, required: false },
    obra: { type: String, required: false },
    certificados: { type: [CertificadoSchema], required: false },
    consumos: { type: ConsumosSchema, required: false },
    precioCubo: { type: Number, required: true },
    totalPedido: { type: Number, required: true },
    cantidadCubos: { type: Number, required: true },
    montoAdelanto: { type: Number, required: false },
    montoPorCobrar: { type: Number, required: false },
    status: { type: String, required: false, default: OrderStatus.pending },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Order = mongoose.model<OrderModel>('Order', orderDBSchema);
}

export default Order;

