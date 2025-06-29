import { getPathParams, getQueryParameters, withApi } from "src/common/utils/middleware";
import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { mediaRepository } from 'src/repositories/mediaRepository';

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getQueryParameters(request)
    const data = await request.json();
    const created = await mediaRepository.updateById(id, data);
    return json(created, 201)

  })
}

export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'medias', '[id]'])
    const created = await mediaRepository.deleteById(id);
    return json(created, 201)

  })
}


export async function GET(request: NextRequest) {  
  return withApi(async () => {

    const filter: any = {};
    const { id } = getQueryParameters(request)

    const trips = await mediaRepository.findById(id);
    return json(trips);
  });
}