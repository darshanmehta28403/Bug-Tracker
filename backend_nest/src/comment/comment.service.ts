import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from './dto/pagination.dto';

import { CommentRepo } from './CommentRepo.repository';

@Injectable()
export class CommentService {
  constructor(private readonly repo: CommentRepo) { }

  async findCommentById(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid Comment ID');
    const comment = await this.repo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async findAllComments(query: PaginationDto) {
    try {
      return await this.repo.findAllPaginated(query);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch Comments');
    }
  }

  async createComment(data: CreateCommentDto) {
    try {
      return await this.repo.create(data);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Comment creation failed');
    }
  }

  async updateComment(id: string, updatedData: UpdateCommentDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const updated = await this.repo.update(id, updatedData);
    if (!updated) throw new NotFoundException('Comment not found');
    return updated;
  }

  async deleteComment(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException('Comment not found');
    return deleted;
  }
}
