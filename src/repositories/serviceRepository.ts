import Service, { ServiceModel } from 'src/models/service';

export class ServiceRepository {

  async getAll(): Promise<ServiceModel[]> {
    try {
      const services = await Service.find({});
      return services;
    } catch (error) {
      console.error('Error getting services:', error);
      throw new Error('Error getting services');
    }
  }

  async getById(id: string): Promise<ServiceModel | null> {
    try {
      const service = await Service.findById(id);
      return service;
    } catch (error) {
      console.error('Error getting services:', error);
      throw new Error('Error getting services');
    }
  }

  async create(data: Partial<ServiceModel>): Promise<ServiceModel> {
    try {
      const newService = new Service(data);
      await newService.save();
      return newService;
    } catch (error) {
      console.error('Error saving Service:', error);
      throw new Error('Error saving Service');
    }
  }

  async update(id: string, data: Partial<ServiceModel>): Promise<ServiceModel> {
    try {
      const serviceUpdated = await Service.findByIdAndUpdate(id, data, { new: true });
      if (!serviceUpdated) {
        throw new Error('Service no found');
      }
      return serviceUpdated;
    } catch (error) {
      console.error('Error updating Service:', error);
      throw new Error('Error updating Service');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Service.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Service no found');
      }
    } catch (error) {
      console.error('Error deleting Service:', error);
      throw new Error('Error deleting Service');
    }
  }
}
