import mongoose from 'mongoose';
import Kardex, { GETAllKardex, KardexModel } from 'src/models/kardex';
import Material from 'src/models/material';

export class KardexRepository {
  async getAll(filters: object, params?: any): Promise<GETAllKardex> {
    try {
      const { month, year, startDate, } = params ?? {}      
      const kardex = await Kardex.find({ ...filters })
        .sort({ date: 1 })

      let initialValues = { quantity: 0, value: 0 };
      if (month && year) {
        const previousMonth = new Date(startDate);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        const prevStartDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
        const prevEndDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);

        const prevKardex = await Kardex.find({
          //@ts-ignore
          materialId: filters.materialId,
          date: {
            $gte: prevStartDate,
            $lt: prevEndDate
          }
        }).sort({ date: 1 });

        if (prevKardex.length > 0) {
          initialValues = {
            quantity: prevKardex[ prevKardex.length - 1 ].quantity,
            value: prevKardex[ prevKardex.length - 1 ].value
          };
        }
      }


      return {
        kardex,
        initialValues
      };
    } catch (error) {
      console.error('Error getting kardex:', error);
      throw new Error('Error getting kardex');
    }
  }

  async getById(id: string): Promise<KardexModel | null> {
    try {
      const kardex = await Kardex.findById(id);
      return kardex;
    } catch (error) {
      console.error('Error getting kardex:', error);
      throw new Error('Error getting kardex');
    }
  }


  async create(data: KardexModel): Promise<KardexModel> {
    try {
      const { materialId, type, quantity, value } = data
      const newKardex = new Kardex(data);
      await newKardex.save();

      // Update stock in material
      const material = await Material.findById({ _id: materialId });
      if (type === 'Ingreso') {
        material.quantity += quantity;
        material.value += value;
      }
      if (type === 'Salida') {
        material.quantity -= quantity;
        material.value -= value;
      }

      await material.save();

      return newKardex;
    } catch (error) {
      console.error('Error saving Kardex:', error);
      throw new Error('Error saving Kardex');
    }
  }

  async update(id: string, data: Partial<KardexModel>): Promise<KardexModel> {
    try {
      const kardexUpdated = await Kardex.findByIdAndUpdate(id, data, { new: true });
      if (!kardexUpdated) {
        throw new Error('Kardex no found');
      }
      return kardexUpdated;
    } catch (error) {
      console.error('Error updating Kardex:', error);
      throw new Error('Error updating Kardex');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const kardex = await Kardex.findById(id) as KardexModel;
      const result = await Kardex.findByIdAndDelete(id);

      // Update stock in material
      const material = await Material.findById({ _id: kardex.materialId });
      if (kardex.type === 'Ingreso') {
        material.quantity -= kardex.quantity;
      }
      if (kardex.type === 'Salida') {
        material.quantity += kardex.quantity;
      }
      await material.save();

      if (!result) {
        throw new Error('Kardex no found');
      }
    } catch (error) {
      console.error('Error deleting Kardex:', error);
      throw new Error('Error deleting Kardex');
    }
  }
}
