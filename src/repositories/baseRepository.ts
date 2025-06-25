// repositories/BaseRepository.ts
import { Model, Document, Types } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  findById(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  findAll(filter: object = {}): Promise<T[]> {
    return this.model.find(filter).sort({ createdAt: -1 }).exec();
  }

  updateById(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
