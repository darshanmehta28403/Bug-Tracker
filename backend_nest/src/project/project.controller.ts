import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/user/transform.interceptor';

@ApiTags('project')
@Controller('api/project')
@UseInterceptors(TransformInterceptor)
export class ProjectController {
  constructor(private ps: ProjectService,) { }

  @ApiOperation({ summary: 'Get all Project with pagination' })
  @Get()
  findAll(@Query() query: any) {
    return this.ps.findAllProjects(query);
  }

  @ApiOperation({ summary: 'Get Project by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ps.findProjectById(id);
  }

  @ApiOperation({ summary: 'Create new Project' })
  @Post()
  create(@Body() Project: CreateProjectDto) {
    return this.ps.createProject(Project);
  }

  @ApiOperation({ summary: 'Update Project' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedData: UpdateProjectDto) {
    return this.ps.updateProject(id, updatedData);
  }

  @ApiOperation({ summary: 'Delete Project' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ps.deleteProject(id);
  }
}
