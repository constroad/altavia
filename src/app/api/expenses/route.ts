
import { getQueryParameters, withApi, withBodyValidation } from "src/common/utils/middleware";

import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { expenseRepository } from "src/repositories/expenseRepository";
import { expenseValidationSchema } from 'src/models/generalExpense';


export async function POST(request: NextRequest) {
  return withApi(async () =>
    withBodyValidation(expenseValidationSchema, request, async (data) => {

      const created = await expenseRepository.create(data);
      return json(created, 201)

    }))
}

export async function GET(request: NextRequest) {
  return withApi(async () => {

    const filter: any = {};
    const { month, year } = getQueryParameters(request)
    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    const expenses = await expenseRepository.findAll(filter);
    return json(expenses);
  });
}