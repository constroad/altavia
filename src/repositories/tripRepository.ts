import Trip, { ITrip } from "src/models/trip";
import { BaseRepository, IPagination } from "./baseRepository";
import { expenseRepository } from "./expenseRepository";
import { IGeneralExpense } from "@/models/generalExpense";

class TripRepository extends BaseRepository<ITrip> {
  constructor() {
    super(Trip)
  }

  async findAll(filter: object = {}, pagination?: IPagination | undefined): Promise<ITrip[]> {
    const { page, limit } = pagination || {}
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 50;

    const allTrips: ITrip[] = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .exec()
    
    const tripIds = allTrips.map((x) => x._id)
    const tripExpenses = await expenseRepository.findAll({
      tripId: { $in: tripIds }
    })

    const expensesMap = Object.fromEntries(
      tripExpenses.map((x) => [ x.tripId, tripExpenses.filter((y) => y.tripId === x.tripId) ])
    )

    return allTrips.map((x) => {
      //@ts-ignore
      const tripExpense: IGeneralExpense[] = expensesMap[ x._id ]
      const totalExpense = tripExpense?.reduce?.((prev, curr) => prev + curr.amount, 0) ?? 0    
      const totalPayments = x.payments?.reduce?.((prev, curr) => prev + curr.amount ,0) ?? 0

      return {
        ...x.toObject(),
        __v: undefined,
        amountDue: totalPayments - (x.Income ?? 0),
        revenue: ((x.Income ?? 0) - totalExpense).toFixed(1)
      }
    })
  }
}

export const tripRepository = new TripRepository()
