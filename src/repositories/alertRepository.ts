import Alert, { IAlert } from "@/models/alert"
import { BaseRepository } from "./baseRepository"

class AlertRepository extends BaseRepository<IAlert> {
  constructor() {
    super(Alert)
  }
}

export const alertRepository = new AlertRepository()
