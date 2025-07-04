import RouteCost, { IRouteCost } from "@/models/routeCost";
import { BaseRepository } from "./baseRepository";

class RouteCostRepository extends BaseRepository<IRouteCost> {
  constructor() {
    super(RouteCost)
  }
}

export const routeCostRepository = new RouteCostRepository()
