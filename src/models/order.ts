import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

export enum OrderStatus {
   pending= 'pending',
   paid= 'paid',
   dispatched= 'dispatched',
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
  fechaVencimiento: z.string().optional(),
  notas: z.string().optional(),
  obra: z.string().optional(),
  precioCubo: z.number(),
  cantidadCubos: z.number(),
  totalPedido: z.number(),
  montoAdelanto: z.number().optional(),
  montoPorCobrar: z.number().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  isCredit: z.boolean().default(false),
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
  fechaVencimiento?: string;
  obra?: string;
  notas?: string;
  cantidadCubos: number;
  precioCubo: number;
  totalPedido: number;
  montoAdelanto?: number;
  montoPorCobrar?: number;
  status?: string;
  isCredit: boolean;
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
    fechaVencimiento: { type: Date, required: false },
    notas: { type: String, required: false },
    obra: { type: String, required: false },
    precioCubo: { type: Number, required: true },
    totalPedido: { type: Number, required: true },
    cantidadCubos: { type: Number, required: true },
    montoAdelanto: { type: Number, required: false },
    montoPorCobrar: { type: Number, required: false },
    isCredit: { type: Boolean, required: true },
    status: { type: String, required: false, default: OrderStatus.pending },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Order = mongoose.model<OrderModel>('Order', orderDBSchema);
}

export default Order;

