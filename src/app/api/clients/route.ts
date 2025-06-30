import { getQueryParameters, withApi, withBodyValidation } from 'src/common/utils/middleware';

import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { clientRepository } from 'src/repositories/clientRepository';
import { clientSchemaValidation } from 'src/models/client';

export async function POST(request: NextRequest) {
  return withApi(async () =>
    withBodyValidation(clientSchemaValidation, request, async (data) => {
      const created = await clientRepository.create(data);
      return json(created, 201);
    })
  );
}

export async function GET(request: NextRequest) {
  return withApi(async () => {

    const filter: any = {};
    const { name, ruc } = getQueryParameters(request)

    if (name) {
      filter.name = name
    }
    if (ruc) {
      filter.ruc = ruc
    }

    const clients = await clientRepository.findAll(filter);
    return json(clients);
  });
}
