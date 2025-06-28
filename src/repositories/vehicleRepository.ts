
import Vehicle, { IVehicle } from "@/models/vehicle";
import { BaseRepository } from "./baseRepository";

class VehicleRepository extends BaseRepository<IVehicle> {
  constructor() {
    super(Vehicle)
  }
}

export const vehicleRepository = new VehicleRepository()
