import { getQueryParameters, withApi, withBodyValidation } from "src/common/utils/middleware";

import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { driverRepository } from "@/repositories/driverRepository";
import { driverSchemaValidation } from "@/models/driver";


export async function POST(request: NextRequest) {
  return withApi(async () => 
    withBodyValidation(driverSchemaValidation, request, async (data) => {
      const created = await driverRepository.create(data);
      return json(created, 201);
    })
  )
}

export async function GET(request: NextRequest) {
  return withApi(async () => {
    const filter: any = {};
    const { dni, name } = getQueryParameters(request)

    if (dni) {
      filter.dni = dni
    }
    if (name) {
      filter.name = name
    }

    const drivers = await driverRepository.findAll(filter);
    return json(drivers);
  })

}