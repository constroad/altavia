import Employee, { EmployeeModel } from '../models/employee';

export class EmployeeRepository {

  async getAll(filter: object): Promise<EmployeeModel[]> {
    try {
      const employees = await Employee.find({...filter}).sort({ createdAt: -1 });
      return employees;
    } catch (error) {
      console.error('Error getting employees:', error);
      throw new Error('Error getting employees');
    }
  }

  async getById(id: string): Promise<EmployeeModel | null> {
    try {
      const employee = await Employee.findById(id);
      return employee;
    } catch (error) {
      console.error('Error getting employees:', error);
      throw new Error('Error getting employees');
    }
  }

  async create(data: EmployeeModel): Promise<EmployeeModel> {
    try {
      const newEmployee = new Employee(data);
      await newEmployee.save();
      return newEmployee;
    } catch (error) {
      console.error('Error saving Employee:', error);
      throw new Error('Error saving Employee');
    }
  }

  async update(id: string, data: Partial<EmployeeModel>): Promise<EmployeeModel> {
    try {
      const employeeUpdated = await Employee.findByIdAndUpdate(id, data, { new: true });
      if (!employeeUpdated) {
        throw new Error('Employee no found');
      }
      return employeeUpdated;
    } catch (error) {
      console.error('Error updating Employee:', error);
      throw new Error('Error updating Employee');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await Employee.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Employee no found');
      }
    } catch (error) {
      console.error('Error deleting Employee:', error);
      throw new Error('Error deleting Employee');
    }
  }
}
