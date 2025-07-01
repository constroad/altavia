import { getQueryParameters, withApi, withBodyValidation } from "src/common/utils/middleware";

import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { vehicleRepository } from 'src/repositories/vehicleRepository';
import { vehicleSchemaValidation } from "src/models/vehicle";


export async function POST(request: NextRequest) {
  return withApi(async () => 
    withBodyValidation(vehicleSchemaValidation, request, async (data) => {
      const created = await vehicleRepository.create(data);
      return json(created, 201);
    })
  )
}

export async function GET(request: NextRequest) {
  return withApi(async () => {
    const filter: any = {};
    const { plate, brand } = getQueryParameters(request)

    if (plate) {
      filter.plate = plate
    }
    if (brand) {
      filter.brand = brand
    }

    const vehicles = await vehicleRepository.findAll(filter);
    return json(vehicles);
  })

}