import { z } from 'zod';
import { withApi, withQueryValidation } from "src/common/utils/middleware";
import { TripRepository } from "src/repositories/tripRepository";
import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  client: z.string().length(24).optional(),
  vehicle: z.string().length(24).optional(),
});

export async function POST(request: NextRequest) {
  return withApi(async () => {

    const data = await request.json();
    const created = await TripRepository.create(data);
    return json(created, 201)

  })
}

export async function GET(request: NextRequest) {


  return withApi(() =>
    withQueryValidation(querySchema, request, async ({ from, to, client, vehicle }) => {
      const filter: any = {};
      if (from || to) {
        filter.startDate = {};
        if (from) filter.startDate.$gte = new Date(from);
        if (to) filter.startDate.$lte = new Date(to);
      }
      if (client) filter.client = client;
      if (vehicle) filter.vehicle = vehicle;

      const trips = await TripRepository.findAll(filter);
      return json(trips);
    })
  );
}