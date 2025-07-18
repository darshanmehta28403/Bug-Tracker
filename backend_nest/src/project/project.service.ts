import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { isValidObjectId } from 'mongoose';
import { PaginationDto } from './dto/pagination.dto';
import { ProjectRepo } from './ProjectRepo.repository';
import { AppEventEmitter } from '../event.emitter.provider';

@Injectable()
export class ProjectService {
  constructor(
    private readonly repo: ProjectRepo
  ) { }

  async findProjectById(id: string): Promise<any> {
    const Project = await this.repo.findById(id);
    if (!Project) throw new NotFoundException('Project not found');
    return Project;
  }

  async findAllProjects(query: PaginationDto): Promise<any> {
    try {
      return await this.repo.findAllPaginated(query);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch Projects');
    }
  }

  async createProject(project: CreateProjectDto): Promise<any> {
    try {
      const created = await this.repo.create(project);
      AppEventEmitter.emit('broadcast-counts');
      return created;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Project creation failed');
    }
  }

  async updateProject(id: string, updatedData: UpdateProjectDto): Promise<any> {
    const updated = await this.repo.update(id, updatedData);
    if (!updated) throw new NotFoundException('Project not found');
    AppEventEmitter.emit('broadcast-counts');
    return updated;
  }

  async deleteProject(id: string): Promise<any | null> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid Project ID format');

    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException('Project not found');
    AppEventEmitter.emit('broadcast-counts');
    return deleted;
  }

  async deleteProjectMember(pid: string, mid: string): Promise<any | null> {
    const deleted = await this.repo.removeMember(pid, mid);
    if (!deleted) throw new NotFoundException('Member not found');
    return deleted;
  }
}
