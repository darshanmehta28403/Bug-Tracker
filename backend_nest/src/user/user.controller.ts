import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';

@ApiTags('user')
@Controller('api/user')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private us: UserService,) { }

  @ApiOperation({ summary: 'Get all user with pagination' })
  @Get()
  findAll(@Query() query: any) {
    return this.us.findAllUsers(query);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.us.findUserById(id);
  }

  @ApiOperation({ summary: 'Create new user' })
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.us.createUser(user);
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedData: UpdateUserDto) {
    return this.us.updateUser(id, updatedData);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.us.deleteUser(id);
  }

  @ApiOperation({ summary: 'user login' })
  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.us.findIdPassword(user);
  }
}
