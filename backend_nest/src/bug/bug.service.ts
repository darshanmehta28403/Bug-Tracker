import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { isValidObjectId } from 'mongoose';
import { BugRepoService } from './bug.repo.service';

@Injectable()
export class BugService {
  constructor(private repo: BugRepoService) { }

  async findBugById(id: string): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Bug ID Format');
    }

    const Bug = await this.repo.findById(id);
    if (!Bug) {
      throw new NotFoundException('Bug not found');
    }

    return Bug;
  }

  async findAllBugs(query: any): Promise<any> {
    try {
      const result = await this.repo.findAllPaginated(query);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch Bugs');
    }
  }

  async createBug(Bug: CreateBugDto): Promise<any> {
    try {
      const created = await this.repo.create(Bug);
      return created;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Bug creation failed');
    }
  }

  async updateBug(id: string, updatedData: UpdateBugDto): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Bug ID format');
    }
    const updated = await this.repo.update(id, updatedData);
    if (!updated) {
      throw new NotFoundException('Bug not found');
    }
    return updated;
  }

  async deleteBug(id: string): Promise<any | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Bug ID format');
    }

    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundException('Bug not found');
    }
    return deleted;
  }
}
