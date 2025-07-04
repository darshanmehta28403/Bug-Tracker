import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { JwtAuthGuard } from 'src/jwt-auth-guard';
import { PaginationDto } from './dto/pagination.dto';
import { EmailDto } from './dto/email.dto';
import { PasswordDto } from './dto/password.dto';

@ApiTags('user')
@Controller('api/user')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private us: UserService,) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all user with pagination' })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.us.findAllUsers(query);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedData: UpdateUserDto) {
    return this.us.updateUser(id, updatedData);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.us.deleteUser(id);
  }

  @ApiOperation({ summary: 'user login' })
  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.us.login(user);
  }

  @ApiOperation({ summary: 'send email' })
  @Post('sendmail')
  sendmail(@Body() username: EmailDto) {
    return this.us.sendMail(username.username);
  }

  @ApiOperation({ summary: 'update password' })
  @Patch('updatePassword/:id')
  updatePassword(@Param('id') id: string, @Body() updatedData: PasswordDto) {
    return this.us.updatePassword(id, updatedData.password);
  }
}
