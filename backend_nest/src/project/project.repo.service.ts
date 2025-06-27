import { Injectable } from '@nestjs/common';
import { Project, ProjectDocument } from './project.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectRepoService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) { }

  async findAllPaginated(query: any) {
    const skip = (query.page - 1) * query.limit;
    const [projects, totalprojects] = await Promise.all([
      this.projectModel.find().skip(skip).limit(query.limit).exec(),
      this.projectModel.countDocuments().exec()
    ]);
    return {
      projects,
      totalprojects,
    };
  }

  async findById(id: string) {
    return this.projectModel.findById(id).exec();
  }

  async findByProjectId(ProjectId: string) {
    return this.projectModel.findOne({ ProjectId }).exec();
  }

  async create(ProjectData: CreateProjectDto) {
    const newProject = new this.projectModel(ProjectData);
    return newProject.save();
  }

  async update(id: string, updatedData: UpdateProjectDto) {
    return this.projectModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
} 