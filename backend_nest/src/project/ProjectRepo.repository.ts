// import { Injectable } from '@nestjs/common';
import { Project, ProjectDocument } from './project.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Types } from 'mongoose';

export class ProjectRepo {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) { }

  async findAllPaginated(query: PaginationDto) {
    const skip = (query.page - 1) * query.limit;
    const [projects, totalprojects] = await Promise.all([
      this.projectModel.find().populate('members', 'name id').skip(skip).limit(query.limit).exec(),
      this.projectModel.countDocuments().exec()
    ]);
    return {
      projects,
      totalprojects,
    };
  }

  async findById(id: string) {
    return this.projectModel.findById(id).populate('members', 'name id').exec();
  }

  async findByProjectId(ProjectId: string) {
    return this.projectModel.findOne({ ProjectId }).populate('members', 'name id').exec();
  }

  async create(ProjectData: CreateProjectDto) {
    const newProject = new this.projectModel(ProjectData);
    return newProject.save();
  }

  async update(id: string, updatedData: UpdateProjectDto) {
    const project = await this.projectModel.findById(id);
    if (!project) throw new Error('Project not found');
    if (updatedData.members?.length) {
      const existingMemberIds = project.members.map((m) => m.toString());
      const newUniqueMembers = updatedData.members.filter(
        (memberId) => !existingMemberIds.includes(memberId.toString())
      );
      const objectIds = newUniqueMembers.map((id) => new Types.ObjectId(id));
      project.members.push(...objectIds);
    }
    if (updatedData.name) project.name = updatedData.name;
    if (updatedData.description) project.description = updatedData.description;
    const saved = await project.save();
    await saved.populate('members', 'name id');
    return saved;
  }

  async delete(id: string) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }

  async removeMember(projectId: string, memberId: string) {
    return this.projectModel.findByIdAndUpdate(
      projectId,
      { $pull: { members: memberId } },
      { new: true }
    ).populate('members', 'name id').exec();
  }
} 