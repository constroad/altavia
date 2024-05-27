import Order, { OrderModel } from '../models/order';

export class OrderRepository {

  async getAll(): Promise<OrderModel[]> {
    try {
      const orders = await Order.find({});
      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new Error('Error getting orders');
    }
  }

  async getById(id: string): Promise<OrderModel | null> {
    try {
      const order = await Order.findById(id);
      return order;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new Error('Error getting orders');
    }
  }


  async create(data: Partial<OrderModel>): Promise<OrderModel> {
    try {
      const newOrder = new Order(data);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      console.error('Error saving Order:', error);
      throw new Error('Error saving Order');
    }
  }

  async update(id: string, data: Partial<OrderModel>): Promise<OrderModel> {
    try {
      const orderUpdated = await Order.findByIdAndUpdate(id, data, { new: true });
      if (!orderUpdated) {
        throw new Error('Order no found');
      }
      return orderUpdated;
    } catch (error) {
      console.error('Error updating Order:', error);
      throw new Error('Error updating Order');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Order.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Order no found');
      }
    } catch (error) {
      console.error('Error deleting Order:', error);
      throw new Error('Error deleting Order');
    }
  }
}
