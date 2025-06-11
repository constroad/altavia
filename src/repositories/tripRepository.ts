import Trip, { ITrip } from "src/models/trip";

export const TripRepository = {
  create: (data: Partial<ITrip>): Promise<ITrip> => Trip.create(data),
  findById: (id: string): Promise<ITrip | null> => Trip.findById(id),
  findAll: (filter: object): Promise<ITrip[]> => Trip.find().find({ ...filter }).sort({ createdAt: -1 }),
  updateById: (id: string, data: Partial<ITrip>): Promise<ITrip | null> => Trip.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => Trip.findByIdAndDelete(id),
};
