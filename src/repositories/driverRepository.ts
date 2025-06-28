
import { BaseRepository } from "./baseRepository";
import Driver, { IDriver } from "@/models/driver";

class DriverRepository extends BaseRepository<IDriver> {
  constructor() {
    super(Driver)
  }
}

export const driverRepository = new DriverRepository()
