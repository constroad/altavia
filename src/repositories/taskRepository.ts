import Task, { TaskModel } from 'src/models/tasks';

export class TaskRepository {

  async getAll(): Promise<TaskModel[]> {
    try {
      const tasks = await Task.find({});
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw new Error('Error getting tasks');
    }
  }

  async getById(id: string): Promise<TaskModel | null> {
    try {
      const task = await Task.findById(id);
      return task;
    } catch (error) {
      console.error('Error getting task:', error);
      throw new Error('Error getting task');
    }
  }

  async create(data: Partial<TaskModel>): Promise<TaskModel> {
    try {
      const newTask = new Task(data);
      await newTask.save();
      return newTask;
    } catch (error) {
      console.error('Error saving task:', error);
      throw new Error('Error saving task');
    }
  }

  async update(id: string, data: Partial<TaskModel>): Promise<TaskModel> {
    try {
      const taskUpdated = await Task.findByIdAndUpdate(id, data, { new: true });
      if (!taskUpdated) {
        throw new Error('Task no found');
      }
      return taskUpdated;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Error updating task');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Task.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Task no found');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Error deleting task');
    }
  }
}
