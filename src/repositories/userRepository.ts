import bcrypt from 'bcryptjs';
import { connectToDatabase } from 'src/common/utils/db';
import User, { UserModel } from 'src/models/user';

export class UserRepository {
  constructor() {
    connectToDatabase();
  }

  async getAll(filter: object = {}): Promise<UserModel[]> {
    try {
      return await User.find({ ...filter }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Error getting users');
    }
  }

  async getById(id: string): Promise<UserModel | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Error getting user');
    }
  }

  async create(data: Partial<UserModel>): Promise<UserModel> {
    try {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
      const newUser = new User(data);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }

  async update(id: string, data: Partial<UserModel>): Promise<UserModel> {
    try {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error('User not found');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Error deleting user');
    }
  }

  async authenticateUser(username: string, password: string): Promise<UserModel | null> {
    try {
      await connectToDatabase();
      const user = await User.findOne({ userName: username });
      if (!user) return null;
      if (!user.isActive) throw new Error('Tu usuario está deshabilitado.');
      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (error) {
      console.error('Error in authenticateUser:', error);
      throw new Error('Error authenticating user');
    }
  }
}
