import { getQueryParameters, withApi } from "src/common/utils/middleware";

import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { MediaRepository } from "src/repositories/mediaRepository";

export async function POST(request: NextRequest) {  
  return withApi(async () => {

    const data = await request.json();
    const created = await MediaRepository.create(data);
    return json(created, 201)

  })
}

export async function GET(request: NextRequest) {  
  return withApi(async () => {
    
    const filter: any = {};
    const { resourceId, type } = getQueryParameters(request)
    if (resourceId) {
      filter.resourceId = resourceId
    }
    if (type) {
      filter.type = type
    }

    const trips = await MediaRepository.findAll(filter);
    return json(trips);
  });
}