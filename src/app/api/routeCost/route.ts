import { getQueryParameters, withApi } from "src/common/utils/middleware";

import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { routeCostRepository } from "@/repositories/routeCostRepository";

export async function POST(request: NextRequest) {  
  return withApi(async () => {

    const data = await request.json();
    const created = await routeCostRepository.create(data);
    return json(created, 201)

  })
}

export async function GET(request: NextRequest) {  
  return withApi(async () => {
    
    const filter: any = {};
    const { origin, destination, type } = getQueryParameters(request)
    if (origin) {
      filter.origin = origin
    }
    if (destination) {
      filter.destination = destination
    }
    if (type) {
      filter.type = type
    }

    const trips = await routeCostRepository.findAll(filter);
    return json(trips);
  });
}