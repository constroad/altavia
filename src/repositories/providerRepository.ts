import Provider, { ProviderModel } from '../models/provider';

export class ProviderRepository {

  async getAll(): Promise<ProviderModel[]> {
    try {
      const providers = await Provider.find({});
      return providers;
    } catch (error) {
      console.error('Error getting providers:', error);
      throw new Error('Error getting providers');
    }
  }

  async getById(id: string): Promise<ProviderModel | null> {
    try {
      const provider = await Provider.findById(id);
      return provider;
    } catch (error) {
      console.error('Error getting provider:', error);
      throw new Error('Error getting provider');
    }
  }


  async create(data: Partial<ProviderModel>): Promise<ProviderModel> {
    try {
      const newProvider = new Provider(data);
      await newProvider.save();
      return newProvider;
    } catch (error) {
      console.error('Error saving Provider:', error);
      throw new Error('Error saving Provider');
    }
  }

  async update(id: string, data: Partial<ProviderModel>): Promise<ProviderModel> {
    try {
      const providerUpdated = await Provider.findByIdAndUpdate(id, data, { new: true });
      if (!providerUpdated) {
        throw new Error('Provider no found');
      }
      return providerUpdated;
    } catch (error) {
      console.error('Error updating Provider:', error);
      throw new Error('Error updating Provider');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Provider.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Provider no found');
      }
    } catch (error) {
      console.error('Error deleting Provider:', error);
      throw new Error('Error deleting Provider');
    }
  }
}
