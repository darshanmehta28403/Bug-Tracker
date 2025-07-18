import { Bug, BugDocument } from './bug.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { PaginationDto } from './dto/pagination.dto';

export class BugRepo {

  constructor(@InjectModel(Bug.name) private bugModel: Model<BugDocument>) { }

  async findAllPaginated(query: PaginationDto) {
    const skip = (query.page - 1) * query.limit;
    const [Bugs, totalBugs] = await Promise.all([
      this.bugModel.find().populate('project', 'name id').populate('reportedBy', 'name id').skip(skip).limit(query.limit).exec(),
      this.bugModel.countDocuments().exec()
    ]);
    return {
      Bugs,
      totalBugs,
    };
  }

  async findById(id: string) {
    return this.bugModel.findById(id).populate('project', 'name id').populate('reportedBy', 'name id').exec();
  }

  async findByBugId(BugId: string) {
    return this.bugModel.findOne({ BugId }).populate('project', 'name id').populate('reportedBy', 'name id').exec();
  }

  async create(BugData: CreateBugDto) {
    const newBug = new this.bugModel(BugData);
    const bug = await newBug.save();
    this.findAllPaginated({ page: 0, limit: 0 });
    return bug;
  }

  async update(id: string, updatedData: UpdateBugDto) {
    return this.bugModel.findByIdAndUpdate(id, updatedData, { new: true }).populate('project', 'name id').populate('reportedBy', 'name id').exec();
  }

  async delete(id: string) {
    return this.bugModel.findByIdAndDelete(id).exec();
  }
} 