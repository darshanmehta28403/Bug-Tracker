import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { BugService } from './bug.service';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/user/transform.interceptor';
import { JwtAuthGuard } from 'src/jwt-auth-guard';
import { PaginationDto } from './dto/pagination.dto';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';

@ApiTags('bug')
@Controller('api/bug')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class BugController {
  constructor(private bs: BugService,) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all Bug with pagination' })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.bs.findAllBugs(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Bug by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bs.findBugById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new Bug' })
  @Post()
  create(@Body() Bug: CreateBugDto) {
    return this.bs.createBug(Bug);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Bug' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedData: UpdateBugDto) {
    return this.bs.updateBug(id, updatedData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete Bug' })
  @Roles('admin', 'qa', 'developer')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bs.deleteBug(id);
  }
}
