
import Client, { IClient } from "@/models/client";
import { BaseRepository } from "./baseRepository";

class ClientRepository extends BaseRepository<IClient> {
  constructor() {
    super(Client)
  }
}

export const clientRepository = new ClientRepository()
