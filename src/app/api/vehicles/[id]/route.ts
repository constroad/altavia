import { getPathParams, withApi } from "@/common/utils/middleware";
import { json } from "@/common/utils/response";
import { vehicleRepository } from "@/repositories/vehicleRepository";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'vehicles', '[id]'])
    const data = await request.json();
    const updated = await vehicleRepository.updateById(id, data);
    return json(updated, 200)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'vehicles', '[id]'])
    const deleted = await vehicleRepository.deleteById(id);
    return json(deleted, 200)

  })
}

export async function GET(request: NextRequest) {  
  return withApi(async () => {

    const filter: any = {};
    const { id } = getPathParams(request, ['api', 'vehicles', '[id]'])

    const vehicle = await vehicleRepository.findById(id);
    return json(vehicle);
  });
}