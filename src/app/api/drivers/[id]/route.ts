import { getPathParams, withApi } from "@/common/utils/middleware";
import { json } from "@/common/utils/response";
import { driverRepository } from "@/repositories/driverRepository";
import { mediaRepository } from "@/repositories/mediaRepository";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'drivers', '[id]'])
    const data = await request.json();
    const updated = await driverRepository.updateById(id, data);
    return json(updated, 200)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'drivers', '[id]'])
    const deleted = await driverRepository.deleteById(id);

     if (!deleted) {
      return json({ error: 'Conductor no encontrado' }, 404);
    }

    // Elimina los medias relacionados
    await mediaRepository.deleteByResourceId(id);

    return json(deleted, 200)

  })
}

export async function GET(request: NextRequest) {
  return withApi(async () => {

    const filter: any = {};
    const { id } = getPathParams(request, ['api', 'drivers', '[id]'])

    const driver = await driverRepository.findById(id);
    return json(driver)
  })
}