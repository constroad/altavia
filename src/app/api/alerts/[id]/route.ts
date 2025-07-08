import { getPathParams, withApi } from "@/common/utils/middleware";
import { json } from "@/common/utils/response";
import { alertRepository } from "@/repositories/alertRepository";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'alerts', '[id]'])
    const data = await request.json();
    const updated = await alertRepository.updateById(id, data);
    return json(updated, 200)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'alerts', '[id]'])
    const deleted = await alertRepository.deleteById(id);
    return json(deleted, 200)

  })
}

export async function GET(request: NextRequest) {  
  return withApi(async () => {

    const filter: any = {};
    const { id } = getPathParams(request, ['api', 'alerts', '[id]'])

    const alert = await alertRepository.findById(id);
    return json(alert);
  });
}