import Trip, { ITrip } from "src/models/trip";
import { BaseRepository } from "./baseRepository";

class TripRepository extends BaseRepository<ITrip> {
  constructor() {
    super(Trip)
  }
}

export const tripRepository = new TripRepository()
