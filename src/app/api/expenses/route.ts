
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
    const { startDate, endDate, status } = getQueryParameters(request)

    if (status) {
      filter.status = status
    }

    const date1 = new Date(startDate)
    const date2 = new Date(endDate)
    const startOfDay = new Date(date1.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date2.setHours(23, 59, 59, 999));

    filter.date = { $gte: startOfDay, $lte: endOfDay };


    const expenses = await expenseRepository.findAll(filter);
    return json(expenses);
  });
}