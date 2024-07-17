import Material, { MaterialModel } from 'src/models/material';

export class MaterialRepository {
  async getAll(filters: object): Promise<MaterialModel[]> {
    try {

      const materials = await Material.find({ ...filters })

      return materials;
    } catch (error) {
      console.error('Error getting materials:', error);
      throw new Error('Error getting materials');
    }
  }

  async getById(id: string): Promise<MaterialModel | null> {
    try {
      const material = await Material.findById(id);
      return material;
    } catch (error) {
      console.error('Error getting materials:', error);
      throw new Error('Error getting materials');
    }
  }


  async create(data: MaterialModel): Promise<MaterialModel> {
    try {
      const newMaterial = new Material(data);
      await newMaterial.save();
      return newMaterial;
    } catch (error) {
      console.error('Error saving Material:', error);
      throw new Error('Error saving Material');
    }
  }

  async update(id: string, data: Partial<MaterialModel>): Promise<MaterialModel> {
    try {
      const materialUpdated = await Material.findByIdAndUpdate(id, data, { new: true });
      if (!materialUpdated) {
        throw new Error('Material no found');
      }
      return materialUpdated;
    } catch (error) {
      console.error('Error updating Material:', error);
      throw new Error('Error updating Material');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Material.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Material no found');
      }
    } catch (error) {
      console.error('Error deleting Material:', error);
      throw new Error('Error deleting Material');
    }
  }
}
