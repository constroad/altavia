import { getPathParams, withApi } from "src/common/utils/middleware";
import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { tripRepository } from "@/repositories/tripRepository";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'trips', '[id]'])
    const data = await request.json();
    const created = await tripRepository.updateById(id, data);
    return json(created, 201)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'trips', '[id]'])
    const created = await tripRepository.deleteById(id);
    return json(created, 201)

  })
}

export async function GET(request: NextRequest) {  
  return withApi(async () => {

    const filter: any = {};
    const { id } = getPathParams(request, ['api', 'trips', '[id]'])

    const trips = await tripRepository.findById(id);
    return json(trips);
  });
}

export async function PATCH(request: NextRequest) {
  return withApi(async () => {
    const { id } = getPathParams(request, ['api', 'trips', '[id]']);
    const data = await request.json();

    const updatedTrip = await tripRepository.updateById(id, data);
    return json(updatedTrip, 200);
  });
}
