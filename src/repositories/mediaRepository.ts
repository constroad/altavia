
import Media, { IMedia } from "src/models/media";
import { BaseRepository } from "./baseRepository";
class MediaRepository extends BaseRepository<IMedia> {
  constructor() {
    super(Media);
  }

  // Método personalizado
  findByType(type: string): Promise<IMedia[]> {
    return this.model.find({ type }).exec();
  }
}

export const mediaRepository = new MediaRepository();
