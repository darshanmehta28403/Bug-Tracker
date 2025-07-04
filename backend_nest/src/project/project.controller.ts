import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/user/transform.interceptor';
import { MongoIdPipeService } from './mongo-id-pipe.service';
import { JwtAuthGuard } from 'src/jwt-auth-guard';
import { PaginationDto } from './dto/pagination.dto';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';

@ApiTags('project')
@Controller('api/project')
@ApiBearerAuth()
@Roles('admin')
@UseInterceptors(TransformInterceptor)
export class ProjectController {
  constructor(private ps: ProjectService,) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all Project with pagination' })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.ps.findAllProjects(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Project by ID' })
  @Roles('developer')
  @Get(':id')
  findById(@Param('id', MongoIdPipeService) id: string) {
    return this.ps.findProjectById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create new Project' })
  @Roles('admin', 'developer')
  @Post()
  create(@Body() Project: CreateProjectDto) {
    return this.ps.createProject(Project);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update Project' })
  @Roles('admin', 'developer')
  @Patch(':id')
  update(@Param('id', MongoIdPipeService) id: string, @Body() updatedData: UpdateProjectDto) {
    return this.ps.updateProject(id, updatedData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete Project' })
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id', MongoIdPipeService) id: string) {
    return this.ps.deleteProject(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete Project Member' })
  @Roles('admin')
  @Delete('member/:projectId/:memberId')
  deleteMember(@Param('projectId', MongoIdPipeService) projectId: string, @Param('memberId', MongoIdPipeService) memberId: string) {
    return this.ps.deleteProjectMember(projectId, memberId);
  }
}
