import mongoose from 'mongoose';
import Dispatch, { DispatchModel, IGetAll } from '../models/dispatch';
import { ClientRepository } from './clientRepository';
import { OrderRepository } from './orderRepository';
import { TransportRepository } from './transportRepository';
import { isEmpty } from 'lodash';
interface IPagination {
  page?: string
  limit?: string
}

export class DispatchRepository {

  async getAllByIds(filters: object): Promise<DispatchModel[]> {
    try {
      const total = await Dispatch.countDocuments({ ...filters })
      const dispatches = await Dispatch.find({ ...filters })
        .sort({ createdAt: -1 })


      return dispatches
    } catch (error) {
      console.error('Error getting dispatchs:', error);
      throw new Error('Error getting dispatchs');
    }
  }
  async getAll(filters: object, pagination?: IPagination): Promise<IGetAll> {
    try {
      // const { page, limit, ...filters } = query || {}
      const total = await Dispatch.countDocuments({ ...filters });

      const { page, limit } = pagination || {}
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : total;

      const dispatchs = await Dispatch.find({ ...filters })
        .sort({ date: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      const clientIds = dispatchs.filter((x) => !isEmpty(x.clientId)).map((d) => new mongoose.Types.ObjectId(d.clientId))
      const orderIds = dispatchs.filter((x) => !isEmpty(x.orderId)).map((d) => new mongoose.Types.ObjectId(d.orderId))
      const transportIds = dispatchs.filter((x) => !isEmpty(x.transportId)).map((d) => new mongoose.Types.ObjectId(d.transportId))

      // getClients Data
      const clientRepo = new ClientRepository()
      const clients = await clientRepo.getAll(
        { _id: { $in: clientIds } },
      );
      const clientsMap = Object.fromEntries(
        clients.map((x) => [ x._id.toString(), x ])
      );
      const orderRepo = new OrderRepository()
      const orders = await orderRepo.getAll(
        { _id: orderIds },
      )
      const ordersMap = Object.fromEntries(
        orders.orders.map((x) => [ x._id?.toString(), x ])
      );
      const transportRepo = new TransportRepository()
      const transports = await transportRepo.getAll(
        { _id: transportIds },
      )
      const transportsMap = Object.fromEntries(
        transports.map((x) => [ x._id.toString(), x ])
      );

      const totals = dispatchs.reduce((prev, curr) => {
        return {
          m3: prev.m3 + curr.quantity,
          total: prev.total + curr.total,
        }
      }, { m3: 0, total: 0 })

      return {
        dispatchs: dispatchs.map((x) => {
          let orderText = ''
          const orderData = ordersMap[ x.orderId ?? '' ]
          if (orderData) {
            const scheduleDate = orderData?.fechaProgramacion.toLocaleDateString('es-PE')
            orderText = `${orderData.cliente} ${scheduleDate} ${orderData.cantidadCubos}`
          }
          return {
            ...x.toObject(),
            __v: undefined,
            order: orderText,
            client: clientsMap[ x.clientId ]?.name ?? '',
            clientRuc: clientsMap[ x.clientId ]?.name ?? '',
            company: transportsMap[ x.transportId ]?.name ?? '',
            driverName: x.driverName ?? transportsMap[ x.transportId ]?.driverName ?? '',
            plate: transportsMap[ x.transportId ]?.plate ?? '',
            obra: orderData?.obra ?? x.obra,
            key: new Date().toISOString(),
          }
        }) as IGetAll[ 'dispatchs' ],
        summary: {
          nroRecords: total,
          m3: totals.m3,
          total: totals.total
        },
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        }
      };
    } catch (error) {
      console.error('Error getting dispatchs:', error);
      throw new Error('Error getting dispatchs');
    }
  }

  async getById(id: string): Promise<DispatchModel | null> {
    try {
      const dispatch = await Dispatch.findById(id);
      return dispatch;
    } catch (error) {
      console.error('Error getting dispatchs:', error);
      throw new Error('Error getting dispatchs');
    }
  }


  async create(data: Partial<DispatchModel>): Promise<DispatchModel> {
    try {
      const newDispatch = new Dispatch(data);
      await newDispatch.save();
      return newDispatch;
    } catch (error) {
      console.error('Error saving Dispatch:', error);
      throw new Error('Error saving Dispatch');
    }
  }

  async update(id: string, data: Partial<DispatchModel>): Promise<DispatchModel> {
    try {
      console.log('update', data);
      const dispatchUpdated = await Dispatch.findByIdAndUpdate(id, data, { new: true });
      console.log('dispatchUpdated', dispatchUpdated);
      if (!dispatchUpdated) {
        throw new Error('Dispatch no found');
      }
      return dispatchUpdated;
    } catch (error) {
      console.error('Error updating Dispatch:', error);
      throw new Error('Error updating Dispatch');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Dispatch.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Dispatch no found');
      }
    } catch (error) {
      console.error('Error deleting Dispatch:', error);
      throw new Error('Error deleting Dispatch');
    }
  }
}
