import Trip, { ITrip } from "src/models/trip";
import { BaseRepository, IPagination } from "./baseRepository";
import { expenseRepository } from "./expenseRepository";

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
    const tripsExpenses = await expenseRepository.findAll({
      tripId: { $in: tripIds }
    })    

    return allTrips.map((x) => {
      const item = x.toObject()      
      const tripExpense = tripsExpenses.filter((y) => y.tripId?.toString() === item._id.toString()) ?? []
      const totalExpense = tripExpense?.reduce?.((prev, curr) => prev + curr.amount, 0) ?? 0    
      const totalPayments = x.payments?.reduce?.((prev, curr) => prev + curr.amount ,0) ?? 0

      return {
        ...item,
        __v: undefined,
        amountDue: totalPayments - (x.Income ?? 0),
        revenue: ((x.Income ?? 0) - totalExpense),
        expenses: totalExpense
      }
    })
  }
}

export const tripRepository = new TripRepository()
