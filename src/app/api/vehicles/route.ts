import { withApi } from "src/common/utils/middleware";
import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { vehicleRepository } from '@/repositories/vehicleRepository';


export async function POST(request: NextRequest) {
  return withApi(async () => {

    const data = await request.json();
    const created = await vehicleRepository.create(data);
    return json(created, 201)

  })
}

export async function GET(request: NextRequest) {

  return withApi(async () => {
    const filter: any = {};

    const vehicles = await vehicleRepository.findAll(filter);
    return json(vehicles);
  })

}