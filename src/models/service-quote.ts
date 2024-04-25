import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { ServiceModel } from './service';

// Schema validation
export const serviceQuoteValidationSchema = z.object({
  _id: z.string().optional(),
  clientId: z.string().min(1),
  nro: z.number(),
  date: z.date(),
  items: z.array(z.object({
    description: z.string().min(1),
    alias: z.string().optional(),
    phase: z.string().optional(),
    unit: z.string().optional(),
    inches: z.number().optional(),
    flete: z.number().optional(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
  })),
  notes: z.array(z.object({
    title: z.string(),
    texts: z.array(z.object({
      id: z.string(),
      value: z.string().optional()
    }))
  })),
  subTotal: z.number(),
  igv: z.number(),
  total: z.number(),
  costs: z.object({
    prodInfo: z.object({
      clientName: z.string(),
      days: z.number(),
      m3Daily: z.number(),
      m3Produced: z.number(),
      metrado: z.number(),
      thickness: z.number(),
      waste: z.number(),
    }),
    asphalt: z.array(z.object({
      'Dosis': z.number(),
      'Insumo': z.string(),
      'M3/GLS': z.number(),
      'Precio': z.number(),
      'Total': z.number(),
      'id': z.number()
    })),
    imprimacion: z.array(z.object({
      'Cantidad': z.number(),
      'Item': z.string(),
      'Precio': z.number(),
      'Total': z.number(),
      'id': z.number()
    })),
    service: z.array(z.object({
      'Cantidad': z.number(),
      'Item': z.string(),
      'Precio': z.number(),
      'Total': z.number(),
      'id': z.number()
    })),
    priceM3: z.number(),
    priceM2: z.number()
  }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IServiceQuoteValidationSchema = z.infer<typeof serviceQuoteValidationSchema>


// DB model + schema
export interface ServiceQuoteModel extends Document {
  clientId: string;
  date: Date;
  nro: number;
  items: {
    description: string;
    alias: string;
    phase: string;
    unit: string;
    inches: number;
    flete: number;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes: {
    title?: string;
    texts: {
      id: string;
      value: string;
    }[];
  }[];
  subTotal: number;
  igv: number;
  total: number;
  costs: {
    prodInfo: {
      clientName: string;
      days: number;
      m3Daily: number;
      m3Produced: number;
      metrado: number;
      thickness: number;
      waste: number;
    };
    asphalt: {
      'Dosis': number;
      'Insumo': string;
      'M3/GLS': number;
      'Precio': number;
      'Total': number;
      'id': number;
    }[];
    imprimacion: {
      'Cantidad': number;
      'Item': string;
      'Precio': number;
      'Total': number;
      'id': number;
    }[];
    service: {
      'Cantidad': number;
      'Item': string;
      'Precio': number;
      'Total': number;
      'id': number;
    }[];
    priceM3: number;
    priceM2: number;
  };
}

let ServiceQuote: Model<ServiceQuoteModel>;

try {
  ServiceQuote = mongoose.model('ServiceQuote') as Model<ServiceQuoteModel>;
} catch (e) {
  const serviceQuoteDBSchema = new Schema({
    clientId: { type: String, required: true },
    nro: { type: Number, required: true },
    date: { type: Date, required: true },
    items: [{
      description: { type: String, required: true },
      alias: { type: String, optional: true },
      phase: { type: String, optional: true },
      unit: { type: String, optional: true },
      inches: { type: Number, optional: true },
      flete: { type: Number, optional: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      total: { type: Number, required: true },
    }],
    notes: [{
      title: { type: String, optional: true },
      texts: [{
        id: { type: String, required: true },
        value: { type: String, optional: true },
      }]
    }],
    subTotal: { type: Number, required: true },
    igv: { type: Number, required: true },
    total: { type: Number, required: true },
    costs: {
      prodInfo: {
        clientName: { type: String, required: false },
        days: { type: Number, required: false },
        m3Daily: { type: Number, required: false },
        m3Produced: { type: Number, required: false },
        metrado: { type: Number, required: false },
        thickness: { type: Number, required: false },
        waste: { type: Number, required: false },
      },
      asphalt: [{
        'Dosis': { type: Number, required: false },
        'Insumo': { type: String, required: false },
        'M3/GLS': { type: Number, required: false },
        'Precio': { type: Number, required: false },
        'Total': { type: Number, required: false },
        'id': { type: Number, required: false }
      }],
      imprimacion: [{
        'Cantidad': { type: Number, required: false },
        'Item': { type: String, required: false },
        'Precio': { type: Number, required: false },
        'Total': { type: Number, required: false },
        'id': { type: Number, required: false }
      }],
      service: [{
        'Cantidad': { type: Number, required: false },
        'Item': { type: String, required: false },
        'Precio': { type: Number, required: false },
        'Total': { type: Number, required: false },
        'id': { type: Number, required: false }
      }],
      priceM3: { type: Number, required: false },
      priceM2: { type: Number, required: false }
    }
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  ServiceQuote = mongoose.model<ServiceQuoteModel>('ServiceQuote', serviceQuoteDBSchema);
}

export default ServiceQuote;