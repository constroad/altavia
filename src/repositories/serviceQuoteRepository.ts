import ServiceQuote, { ServiceQuoteModel } from '../models/service-quote';

export class ServiceQuoteRepository {

  async getAll(): Promise<ServiceQuoteModel[]> {
    try {
      const serviceQuotes = await ServiceQuote.find({});
      return serviceQuotes;
    } catch (error) {
      console.error('Error getting service quotes:', error);
      throw new Error('Error getting service quotes');
    }
  }

  async getById(id: string): Promise<ServiceQuoteModel | null> {
    try {
      const serviceQuote = await ServiceQuote.findById(id);
      return serviceQuote;
    } catch (error) {
      console.error('Error getting service quote:', error);
      throw new Error('Error getting service quotes');
    }
  }

  async create(data: Partial<ServiceQuoteModel>): Promise<ServiceQuoteModel> {
    try {
      const newServiceQuote = new ServiceQuote(data);
      await newServiceQuote.save();
      return newServiceQuote;
    } catch (error) {
      console.error('Error saving service quote:', error);
      throw new Error('Error saving service quote');
    }
  }

  async update(id: string, data: Partial<ServiceQuoteModel>): Promise<ServiceQuoteModel> {
    try {
      const serviceQuoteUpdated = await ServiceQuote.findByIdAndUpdate(id, data, { new: true });
      if (!serviceQuoteUpdated) {
        throw new Error('Service quote no found');
      }
      return serviceQuoteUpdated;
    } catch (error) {
      console.error('Error updating service quote:', error);
      throw new Error('Error updating service quote');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await ServiceQuote.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Service quote no found');
      }
    } catch (error) {
      console.error('Error deleting service quote:', error);
      throw new Error('Error deleting service quote');
    }
  }
}
