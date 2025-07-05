import { getPathParams, withApi } from "src/common/utils/middleware";
import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { routeCostRepository } from "@/repositories/routeCostRepository";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'routeCost', '[id]'])
    const data = await request.json();
    const created = await routeCostRepository.updateById(id, data);
    return json(created, 201)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'routeCost', '[id]'])
    const created = await routeCostRepository.deleteById(id);
    return json(created, 201)

  })
}


export async function GET(request: NextRequest) {  
  return withApi(async () => {

    const filter: any = {};
    const { id } = getPathParams(request, ['api', 'trips', '[id]'])

    const trips = await routeCostRepository.findById(id);
    return json(trips);
  });
}