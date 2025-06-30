import { getPathParams, withApi } from "@/common/utils/middleware";
import { json } from "@/common/utils/response";
import { clientRepository } from "@/repositories/clientRepository";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'clients', '[id]'])
    const data = await request.json();
    const created = await clientRepository.updateById(id, data);
    return json(created, 201)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'clients', '[id]'])
    const created = await clientRepository.deleteById(id);
    return json(created, 201)

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