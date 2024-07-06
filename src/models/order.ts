import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { IDispatchValidationSchema } from './dispatch';

export enum OrderStatus {
  pending = 'pendiente',
  dispatched = 'despachado',
  deleted = 'eliminado',
  rejected = 'rechazado'
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
  igv: z.number(),
  igvCheck: z.boolean().optional().default(true),
  precioCubo: z.number(),
  cantidadCubos: z.number(),
  subTotal: z.number(),
  totalPedido: z.number(),
  montoPorCobrar: z.number(),
  status: z.nativeEnum(OrderStatus).optional(),
  isCredit: z.boolean().default(false),
  isPaid: z.boolean().default(false),
  invoice: z.string().optional(),
  payments: z.array(z.object({
    _id: z.string().optional(),
    date: z.date(),
    amount: z.number(),
    notes: z.string()
  })),
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
  fechaVencimiento?: Date;
  obra?: string;
  notas?: string;
  cantidadCubos: number;
  precioCubo: number;
  subTotal: number;
  totalPedido: number;
  status?: string;
  isCredit: boolean;
  isPaid: boolean;
  igv: number;
  igvCheck?: boolean;
  invoice?: string;
  payments: {
    date: Date
    amount: number
    notes: string
  }[]
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

export interface IOrderList extends IOrderValidationSchema {
  dispatches: IDispatchValidationSchema[],
  m3dispatched: number,
  m3Pending: number,
  m3Value: number
}

export interface IOrderGetAll {
  orders: IOrderList[],
  pagination: {
    page: number,
    limit: number,
    totalPages: number,
  }
}

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
    invoice: { type: String, required: false },
    precioCubo: { type: Number, required: true },
    totalPedido: { type: Number, required: true },
    subTotal: { type: Number, optional: false },
    cantidadCubos: { type: Number, required: true },
    igvCheck: { type: Boolean, optional: true },
    igv: { type: Number, optional: true },
    isCredit: { type: Boolean, required: true },
    isPaid: { type: Boolean, required: true },
    status: { type: String, required: false, default: OrderStatus.pending },
    payments: [
      {
        date: Date,
        amount: Number,
        notes: String
      }
    ]
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Order = mongoose.model<OrderModel>('Order', orderDBSchema);
}

export default Order;

