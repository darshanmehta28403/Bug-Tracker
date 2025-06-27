import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { isValidObjectId } from 'mongoose';
import { CommentRepoService } from './comment.repo.service';

@Injectable()
export class CommentService {
  constructor(private repo: CommentRepoService) { }

  async findCommentById(id: string): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Comment ID Format');
    }

    const Comment = await this.repo.findById(id);
    if (!Comment) {
      throw new NotFoundException('Comment not found');
    }

    return Comment;
  }

  async findAllComments(query: any): Promise<any> {
    try {
      const result = await this.repo.findAllPaginated(query);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch Comments');
    }
  }

  async createComment(Comment: CreateCommentDto): Promise<any> {
    try {
      const created = await this.repo.create(Comment);
      return created;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Comment creation failed');
    }
  }

  async updateComment(id: string, updatedData: UpdateCommentDto): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Comment ID format');
    }
    const updated = await this.repo.update(id, updatedData);
    if (!updated) {
      throw new NotFoundException('Comment not found');
    }
    return updated;
  }

  async deleteComment(id: string): Promise<any | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Comment ID format');
    }

    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundException('Comment not found');
    }
    return deleted;
  }
}
