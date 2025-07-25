import { getPathParams, withApi } from "@/common/utils/middleware";
import { json } from "@/common/utils/response";
import { clientRepository } from "@/repositories/clientRepository";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'clients', '[id]'])
    const data = await request.json();
    const updated = await clientRepository.updateById(id, data);
    return json(updated, 200)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'clients', '[id]'])
    const deleted = await clientRepository.deleteById(id);
    return json(deleted, 200)

  })
}

export async function GET(request: NextRequest) {  
  return withApi(async () => {

    const filter: any = {};
    const { id } = getPathParams(request, ['api', 'clients', '[id]'])

    const client = await clientRepository.findById(id);
    return json(client);
  });
}