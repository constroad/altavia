import { getQueryParameters, withApi } from "src/common/utils/middleware";
import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { tripRepository } from '@/repositories/tripRepository';


export async function POST(request: NextRequest) {
  return withApi(async () => {

    const data = await request.json();
    const created = await tripRepository.create(data);
    return json(created, 201)

  })
}

export async function GET(request: NextRequest) {


  return withApi(async () => {
    const { startDate, endDate, status, type, client, origin, page, limit } = getQueryParameters(request)

    const pagination = { page: page, limit: limit }
    const filter: any = {};
    if (type) {
      filter.type = type
    }
    if (status) {
      filter.status = status
    }
    if (client) {
      filter.client = client
    }
    if (origin) {
      filter.origin = origin
    }
    if (startDate && endDate) {
      const date1 = new Date(startDate)
      const date2 = new Date(endDate)
      const startOfDay = new Date(date1.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date2.setHours(23, 59, 59, 999));

      filter.startDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const trips = await tripRepository.findAll(filter, pagination);
    return json(trips);
  }

  );
}