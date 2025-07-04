import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { PaginationDto } from './dto/pagination.dto';

import { BugRepo } from './BugRepo.repository';

@Injectable()
export class BugService {
  constructor(private readonly repo: BugRepo) { }

  async findBugById(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid Bug ID Format');
    const bug = await this.repo.findById(id);
    if (!bug) throw new NotFoundException('Bug not found');
    return bug;
  }

  async findAllBugs(query: PaginationDto) {
    try {
      return await this.repo.findAllPaginated(query);
    } catch (err) {
      throw new InternalServerErrorException(err.message || 'Fetch failed');
    }
  }

  async createBug(data: CreateBugDto) {
    try {
      return await this.repo.create(data);
    } catch (err) {
      throw new InternalServerErrorException(err.message || 'Creation failed');
    }
  }

  async updateBug(id: string, updated: UpdateBugDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const result = await this.repo.update(id, updated);
    if (!result) throw new NotFoundException('Not found');
    return result;
  }

  async deleteBug(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const result = await this.repo.delete(id);
    if (!result) throw new NotFoundException('Not found');
    return result;
  }
}
