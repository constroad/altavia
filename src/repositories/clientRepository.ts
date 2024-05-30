import Client, { ClientModel } from '../models/client';

export class ClientRepository {

  async getAll(): Promise<ClientModel[]> {
    try {
      const clients = await Client.find({}).sort({ createdAt: -1 })
      return clients;
    } catch (error) {
      console.error('Error getting clients:', error);
      throw new Error('Error getting clients');
    }
  }

  async getById(id: string): Promise<ClientModel | null> {
    try {
      const client = await Client.findById(id);
      return client;
    } catch (error) {
      console.error('Error getting clients:', error);
      throw new Error('Error getting clients');
    }
  }


  async create(data: Partial<ClientModel>): Promise<ClientModel> {
    try {
      const newClient = new Client(data);
      await newClient.save();
      return newClient;
    } catch (error) {
      console.error('Error saving Client:', error);
      throw new Error('Error saving Client');
    }
  }

  async update(id: string, data: Partial<ClientModel>): Promise<ClientModel> {
    try {
      const clientUpdated = await Client.findByIdAndUpdate(id, data, { new: true });
      if (!clientUpdated) {
        throw new Error('Client no found');
      }
      return clientUpdated;
    } catch (error) {
      console.error('Error updating Client:', error);
      throw new Error('Error updating Client');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Client.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Client no found');
      }
    } catch (error) {
      console.error('Error deleting Client:', error);
      throw new Error('Error deleting Client');
    }
  }
}
