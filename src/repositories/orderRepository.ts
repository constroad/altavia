import Order, { IOrderGetAll, OrderModel } from '../models/order';
import { DispatchRepository } from './dispatchRepository';
import { DispatchModel, IDispatchValidationSchema } from 'src/models/dispatch';
interface IPagination {
  page: string
  limit: string
}

export class OrderRepository {
  async getAll(filters: object, pagination?: IPagination): Promise<IOrderGetAll> {
    try {
      const { page, limit } = pagination || {}
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 50;
      const orders = await Order.find({ ...filters })
        .sort({ fechaProgramacion: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      const total = await Order.countDocuments({ ...filters });
      const orderIds = orders.map((x) => x._id)
      // getting dispatches
      const dispatchRepo = new DispatchRepository()
      const dispatches = await dispatchRepo.getAllByIds({
        orderId: { $in: orderIds }
      })
      const dispatchMap = Object.fromEntries(
        dispatches.map((x) => [ x.orderId, dispatches.filter((y) => y.orderId === x.orderId) ])
      )

      
      return {
        orders: orders.map((x) => {
          const payments = x.payments.reduce((prev, curr) => prev + curr.amount, 0)
          const list: DispatchModel[] = dispatchMap[ x._id ] ?? []
          const m3dispatched = list
            .reduce((prev, curr) => {
              return prev + curr.quantity
            }, 0)
          const m3RealTotal = m3dispatched * x.precioCubo
          let montoPorCobrar = m3RealTotal - payments
          if (m3RealTotal === 0) {
            montoPorCobrar = x.totalPedido - payments
          }
          if (x.isPaid) {
            montoPorCobrar = 0
          }
          return {
            ...x.toObject(),
            __v: undefined,
            dispatches: dispatches as IDispatchValidationSchema[],
            m3dispatched,
            montoAdelanto: payments,
            m3Pending: x.cantidadCubos - m3dispatched,
            montoPorCobrar,
            m3Value: m3RealTotal
          }
        }),
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        }
      };
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
