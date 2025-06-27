import { Injectable } from '@nestjs/common';
import { Comment, CommentDocument } from './comment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCommentDto } from './dto/create-Comment.dto';
import { UpdateCommentDto } from './dto/update-Comment.dto';

@Injectable()
export class CommentRepoService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }

  async findAllPaginated(query: any) {
    const skip = (query.page - 1) * query.limit;
    const [Comments, totalComments] = await Promise.all([
      this.commentModel.find().skip(skip).limit(query.limit).exec(),
      this.commentModel.countDocuments().exec()
    ]);
    return {
      Comments,
      totalComments,
    };
  }

  async findById(id: string) {
    return this.commentModel.findById(id).exec();
  }

  async findByCommentId(CommentId: string) {
    return this.commentModel.findOne({ CommentId }).exec();
  }

  async create(CommentData: CreateCommentDto) {
    const newComment = new this.commentModel(CommentData);
    return newComment.save();
  }

  async update(id: string, updatedData: UpdateCommentDto) {
    return this.commentModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.commentModel.findByIdAndDelete(id).exec();
  }
} 