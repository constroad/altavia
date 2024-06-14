import Transport, { TransportModel } from '../models/transport';

export class TransportRepository {

  async getAll(filter: object): Promise<TransportModel[]> {
    try {
      const transports = await Transport.find({...filter}).sort({ createdAt: -1 });
      return transports;
    } catch (error) {
      console.error('Error getting transports:', error);
      throw new Error('Error getting transports');
    }
  }

  async getById(id: string): Promise<TransportModel | null> {
    try {
      const transport = await Transport.findById(id);
      return transport;
    } catch (error) {
      console.error('Error getting transports:', error);
      throw new Error('Error getting transports');
    }
  }


  async create(data: Partial<TransportModel>): Promise<TransportModel> {
    try {
      const newTransport = new Transport(data);
      await newTransport.save();
      return newTransport;
    } catch (error) {
      console.error('Error saving Transport:', error);
      throw new Error('Error saving Transport');
    }
  }

  async update(id: string, data: Partial<TransportModel>): Promise<TransportModel> {
    try {
      const transportUpdated = await Transport.findByIdAndUpdate(id, data, { new: true });
      if (!transportUpdated) {
        throw new Error('Transport no found');
      }
      return transportUpdated;
    } catch (error) {
      console.error('Error updating Transport:', error);
      throw new Error('Error updating Transport');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Transport.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Transport no found');
      }
    } catch (error) {
      console.error('Error deleting Transport:', error);
      throw new Error('Error deleting Transport');
    }
  }
}
