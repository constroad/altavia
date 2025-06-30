import { connectToMongoDB } from "@/config/mongoose";
import bcrypt from "bcryptjs";
import User, {IUser} from "src/models/user";

export const UserRepository = {
  findAll: (filter: object): Promise<IUser[]> => User.find().find({...filter}).sort({ createdAt: -1 }),
  findById: (id: string): Promise<IUser | null> => User.findById(id),
  create: async (data: Partial<IUser>): Promise<IUser> => {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
  
    return User.create(data);
  },
  updateById: async (id: string, data: Partial<IUser>): Promise<IUser | null> => {
    console.log('id:', id)
    console.log('data:', data)
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
  
    return User.findByIdAndUpdate(id, data, { new: true });
  },  
  deleteById: (id: string) => User.findByIdAndDelete(id),
  authenticateUser: async (username: string, password: string): Promise<IUser | null> => {
    try {
      await connectToMongoDB();

      const foundUser = await User.findOne({ userName: username });

      if (!foundUser) return null;
      if (!foundUser.isActive) throw new Error("Tu usuario está deshabilitado.");

      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) return null;

      return {
        _id: foundUser._id,
        userName: foundUser.userName,
        role: foundUser.role,
        isActive: foundUser.isActive,
      } as IUser;

    } catch (error) {
      console.error("Error in authenticateUser:", error);
      throw new Error("Error authenticating user");
    }
  }
}