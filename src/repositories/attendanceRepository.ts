import Attendance, { AttendanceModel } from '../models/attendance';

export class AttendanceRepository {

  async getAll(filter: object): Promise<AttendanceModel[]> {
    try {
      const attendances = await Attendance.find({...filter}).sort({ createdAt: -1 });
      return attendances;
    } catch (error) {
      console.error('Error getting attendances:', error);
      throw new Error('Error getting attendances');
    }
  }

  async getById(id: string): Promise<AttendanceModel | null> {
    try {
      const transport = await Attendance.findById(id);
      return transport;
    } catch (error) {
      console.error('Error getting attendances:', error);
      throw new Error('Error getting attendances');
    }
  }


  async create(data: AttendanceModel): Promise<AttendanceModel> {
    try {
      const newTransport = new Attendance(data);
      await newTransport.save();
      return newTransport;
    } catch (error) {
      console.error('Error saving Transport:', error);
      throw new Error('Error saving Transport');
    }
  }

  async update(id: string, data: Partial<AttendanceModel>): Promise<AttendanceModel> {
    try {
      const transportUpdated = await Attendance.findByIdAndUpdate(id, data, { new: true });
      if (!transportUpdated) {
        throw new Error('Transport no found');
      }
      return transportUpdated;
    } catch (error) {
      console.error('Error updating Transport:', error);
      throw new Error('Error updating Transport');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Attendance.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Transport no found');
      }
    } catch (error) {
      console.error('Error deleting Transport:', error);
      throw new Error('Error deleting Transport');
    }
  }
}
