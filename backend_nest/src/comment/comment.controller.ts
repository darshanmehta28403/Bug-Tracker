import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/user/transform.interceptor';
import { JwtAuthGuard } from 'src/jwt-auth-guard';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('comment')
@Controller('api/comment')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class CommentController {
  constructor(private cs: CommentService,) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all Comment with pagination' })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.cs.findAllComments(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Comment by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.cs.findCommentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new Comment' })
  @Post()
  create(@Body() Comment: CreateCommentDto) {
    return this.cs.createComment(Comment);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Comment' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedData: UpdateCommentDto) {
    return this.cs.updateComment(id, updatedData);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete Comment' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cs.deleteComment(id);
  }
}
