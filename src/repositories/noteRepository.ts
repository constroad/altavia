import Note, { NoteModel } from 'src/models/notes';

export class NoteRepository {

  async getAll(): Promise<NoteModel[]> {
    try {
      const notes = await Note.find({});
      return notes;
    } catch (error) {
      console.error('Error getting notes:', error);
      throw new Error('Error getting notes');
    }
  }

  async getById(id: string): Promise<NoteModel | null> {
    try {
      const note = await Note.findById(id);
      return note;
    } catch (error) {
      console.error('Error getting note:', error);
      throw new Error('Error getting note');
    }
  }

  async create(data: Partial<NoteModel>): Promise<NoteModel> {
    try {
      const newNote = new Note(data);
      await newNote.save();
      return newNote;
    } catch (error) {
      console.error('Error saving note:', error);
      throw new Error('Error saving note');
    }
  }

  async update(id: string, data: Partial<NoteModel>): Promise<NoteModel> {
    try {
      const noteUpdated = await Note.findByIdAndUpdate(id, data, { new: true });
      if (!noteUpdated) {
        throw new Error('Note no found');
      }
      return noteUpdated;
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Error updating note');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Note.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Note no found');
      }
    } catch (error) {
      console.error('Error deleting Note:', error);
      throw new Error('Error deleting Note');
    }
  }
}
