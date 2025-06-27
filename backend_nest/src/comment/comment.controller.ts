import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/user/transform.interceptor';

@ApiTags('comment')
@Controller('api/comment')
@UseInterceptors(TransformInterceptor)
export class CommentController {
  constructor(private cs: CommentService,) { }

  @ApiOperation({ summary: 'Get all Comment with pagination' })
  @Get()
  findAll(@Query() query: any) {
    return this.cs.findAllComments(query);
  }

  @ApiOperation({ summary: 'Get Comment by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.cs.findCommentById(id);
  }

  @ApiOperation({ summary: 'Create new Comment' })
  @Post()
  create(@Body() Comment: CreateCommentDto) {
    return this.cs.createComment(Comment);
  }

  @ApiOperation({ summary: 'Update Comment' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedData: UpdateCommentDto) {
    return this.cs.updateComment(id, updatedData);
  }

  @ApiOperation({ summary: 'Delete Comment' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cs.deleteComment(id);
  }
}
