import Trip, { ITrip } from "src/models/trip";

export const TripRepository = {
  create: (data: Partial<ITrip>) => Trip.create(data),
  findById: (id: string) => Trip.findById(id),
  findAll: () => Trip.find(),
  updateById: (id: string, data: Partial<ITrip>) => Trip.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => Trip.findByIdAndDelete(id),
};
