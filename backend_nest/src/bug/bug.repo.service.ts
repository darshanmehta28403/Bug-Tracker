import { Injectable } from '@nestjs/common';
import { Bug, BugDocument } from './bug.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';

@Injectable()
export class BugRepoService {
  constructor(@InjectModel(Bug.name) private bugModel: Model<BugDocument>) { }

  async findAllPaginated(query: any) {
    const skip = (query.page - 1) * query.limit;
    const [Bugs, totalBugs] = await Promise.all([
      this.bugModel.find().skip(skip).limit(query.limit).exec(),
      this.bugModel.countDocuments().exec()
    ]);
    return {
      Bugs,
      totalBugs,
    };
  }

  async findById(id: string) {
    return this.bugModel.findById(id).exec();
  }

  async findByBugId(BugId: string) {
    return this.bugModel.findOne({ BugId }).exec();
  }

  async create(BugData: CreateBugDto) {
    const newBug = new this.bugModel(BugData);
    return newBug.save();
  }

  async update(id: string, updatedData: UpdateBugDto) {
    return this.bugModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.bugModel.findByIdAndDelete(id).exec();
  }
} 