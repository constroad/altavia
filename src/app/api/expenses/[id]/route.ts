import { getPathParams, withApi } from "src/common/utils/middleware";
import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { expenseRepository } from "src/repositories/expenseRepository";

export async function PUT(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'expenses', '[id]'])
    const data = await request.json();
    const created = await expenseRepository.updateById(id, data);
    return json(created, 201)

  })
}
export async function DELETE(request: NextRequest) {
  return withApi(async () => {

    const { id } = getPathParams(request, ['api', 'expenses', '[id]'])
    const created = await expenseRepository.deleteById(id);
    return json(created, 201)

  })
}

export async function GET(request: NextRequest) {  
  return withApi(async () => {

    const filter: any = {};
    const { id } = getPathParams(request, ['api', 'expenses', '[id]'])

    const trips = await expenseRepository.findById(id);
    return json(trips);
  });
}