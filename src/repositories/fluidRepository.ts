
import Fluid, { FluidModel } from "src/models/fluids";

export class FluidRepository {

  async getAll(): Promise<FluidModel[]> {
    try {
      const fluids = await Fluid.find({});
      return fluids;
    } catch (error) {
      console.error('Error getting fluids:', error);
      throw new Error('Error getting fluids');
    }
  }

  async getById(id: string): Promise<FluidModel | null> {
    try {
      const fluid = await Fluid.findById(id);
      return fluid;
    } catch (error) {
      console.error('Error getting fluids:', error);
      throw new Error('Error getting fluids');
    }
  }


  async create(data: Partial<FluidModel>): Promise<FluidModel> {
    try {
      const newFluid = new Fluid(data);
      await newFluid.save();
      return newFluid;
    } catch (error) {
      console.error('Error saving fluid:', error);
      throw new Error('Error saving fluid');
    }
  }

  async update(id: string, data: Partial<FluidModel>): Promise<FluidModel> {
    try {
      const fluidUpdated = await Fluid.findByIdAndUpdate(id, data, { new: true });
      if (!fluidUpdated) {
        throw new Error('fluid no found');
      }
      return fluidUpdated;
    } catch (error) {
      console.error('Error updating fluid:', error);
      throw new Error('Error updating fluid');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Fluid.findByIdAndDelete(id);
      if (!result) {
        throw new Error('fluid no found');
      }
    } catch (error) {
      console.error('Error deleting fluid:', error);
      throw new Error('Error deleting fluid');
    }
  }
}
