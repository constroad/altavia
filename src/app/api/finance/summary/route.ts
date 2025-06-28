
import { getQueryParameters, withApi } from "src/common/utils/middleware";

import { NextRequest } from 'next/server';
import { json } from 'src/common/utils/response';
import { expenseRepository } from "src/repositories/expenseRepository";
import { tripRepository } from "src/repositories/tripRepository";


export async function GET(request: NextRequest) {
  return withApi(async () => {

    const filter: any = {};
    const { month, year } = getQueryParameters(request)

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    filter.date = { $gte: start, $lte: end };

    const expenses = await expenseRepository.findAll(filter);
    const trips = await tripRepository.findAll(filter)

    const totalRevenue = trips.reduce((acc, t) => acc + (t.revenue ?? 0), 0);
    // const totalTripExpenses = trips.reduce((acc, t) => acc + t.expenses.reduce((eAcc, e) => eAcc + e.amount, 0), 0);
    const totalGeneralExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    // const netProfit = totalRevenue - totalTripExpenses - totalGeneralExpenses;

    const response = {
      month,
      year,
      tripsCount: trips.length,
      totalRevenue,
      // totalTripExpenses,
      totalGeneralExpenses,
      // netProfit,
    }

    return json(response);
  });
}