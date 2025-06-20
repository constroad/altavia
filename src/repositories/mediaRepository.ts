
import Media, { IMedia } from "src/models/media";

export const MediaRepository = {
  create: (data: Partial<IMedia>): Promise<IMedia> => Media.create(data),
  findById: (id: string): Promise<IMedia | null> => Media.findById(id),
  findAll: (filter: object): Promise<IMedia[]> => Media.find().find({ ...filter }).sort({ createdAt: -1 }),
  updateById: (id: string, data: Partial<IMedia>): Promise<IMedia | null> => Media.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id: string) => Media.findByIdAndDelete(id),
};
