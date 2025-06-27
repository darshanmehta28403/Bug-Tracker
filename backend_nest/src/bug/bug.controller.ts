import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { BugService } from './bug.service';
import { CreateBugDto } from './dto/create-bug.dto';
import { UpdateBugDto } from './dto/update-bug.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/user/transform.interceptor';

@ApiTags('bug')
@Controller('api/bug')
@UseInterceptors(TransformInterceptor)
export class BugController {
  constructor(private bs: BugService,) { }

  @ApiOperation({ summary: 'Get all Bug with pagination' })
  @Get()
  findAll(@Query() query: any) {
    return this.bs.findAllBugs(query);
  }

  @ApiOperation({ summary: 'Get Bug by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bs.findBugById(id);
  }

  @ApiOperation({ summary: 'Create new Bug' })
  @Post()
  create(@Body() Bug: CreateBugDto) {
    return this.bs.createBug(Bug);
  }

  @ApiOperation({ summary: 'Update Bug' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedData: UpdateBugDto) {
    return this.bs.updateBug(id, updatedData);
  }

  @ApiOperation({ summary: 'Delete Bug' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bs.deleteBug(id);
  }
}
