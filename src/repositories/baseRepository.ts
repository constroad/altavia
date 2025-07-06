// repositories/BaseRepository.ts
import { Model, Document, Types, isValidObjectId } from 'mongoose';

export interface IPagination {
  page: string
  limit: string
}


export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  findById(id: string | Types.ObjectId): Promise<T | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null);
    return this.model.findById(id).exec();
  }

  findAll(filter: object = {}, pagination?: IPagination): Promise<T[]> {
    const { page, limit } = pagination || {}
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    return this.model.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .exec();
  }

  updateById(id: string, data: Partial<T>): Promise<T | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null);
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteById(id: string): Promise<T | null> {
    if (!isValidObjectId(id)) return Promise.resolve(null);
    return this.model.findByIdAndDelete(id).exec();
  }

  // Por si luego quieres obtener conteos sin traer datos:
  count(filter: object = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
