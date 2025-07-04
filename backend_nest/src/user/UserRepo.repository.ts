import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';

export class UserRepo {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findAllPaginated(query: PaginationDto) {
    const skip = (query.page - 1) * query.limit;
    const [users, totalUsers] = await Promise.all([
      this.userModel.find().skip(skip).limit(query.limit).exec(),
      this.userModel.countDocuments().exec()
    ]);
    return {
      users,
      totalUsers,
    };
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByUserId(userId: string) {
    return this.userModel.findOne({ userId }).exec();
  }

  async create(userData: CreateUserDto) {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async update(id: string, updatedData: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findOne(filter: any) {
    return this.userModel.findOne(filter).exec();
  }
} 