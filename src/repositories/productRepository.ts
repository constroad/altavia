import Product, { ProductModel } from '../models/products';

export class ProductRepository {

  async getAll(): Promise<ProductModel[]> {
    try {
      const products = await Product.find({});
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Error getting products');
    }
  }

  async getById(id: string): Promise<ProductModel | null> {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Error getting products');
    }
  }

  async create(data: Partial<ProductModel>): Promise<ProductModel> {
    try {
      const newProduct = new Product(data);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error('Error saving Product:', error);
      throw new Error('Error saving Product');
    }
  }

  async update(id: string, data: Partial<ProductModel>): Promise<ProductModel> {
    try {
      const productUpdated = await Product.findByIdAndUpdate(id, data, { new: true });
      if (!productUpdated) {
        throw new Error('Product no found');
      }
      return productUpdated;
    } catch (error) {
      console.error('Error updating Product:', error);
      throw new Error('Error updating Product');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Product.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Product no found');
      }
    } catch (error) {
      console.error('Error deleting Product:', error);
      throw new Error('Error deleting Product');
    }
  }
}
