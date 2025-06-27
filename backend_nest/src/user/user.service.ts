import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserRepoService } from './user.repo.service';
import { LoginUserDto } from './dto/login-user.dto';
import { hashPassword, comparePassword } from './user.util';

@Injectable()
export class UserService {
  constructor(private repo: UserRepoService, private jwtService: JwtService) { }

  async findUserById(id: string): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID Format');
    }

    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAllUsers(query: any): Promise<any> {
    try {
      const result = await this.repo.findAllPaginated(query);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch users');
    }
  }

  async createUser(user: CreateUserDto): Promise<any> {
    try {
      user.plainPassword = user.password;
      user.password = await hashPassword(user.password);
      const created = await this.repo.create(user);
      return created;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'User creation failed');
    }
  }

  async updateUser(id: string, updatedData: UpdateUserDto): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    updatedData.password = await hashPassword(updatedData.password);
    const updated = await this.repo.update(id, updatedData);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async deleteUser(id: string): Promise<any | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return deleted;
  }

  async findIdPassword(userData: LoginUserDto): Promise<any> {
    const { username, password } = userData;
    const user = await this.repo.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const pass = await comparePassword(password, user.password);
    if (!pass) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    console.log("Part 2");
    const access_token = this.jwtService.sign(
      { username: user.username, _id: user._id },
      { secret: process.env.JWT_SECRET }
    );
    return { user, access_token };
  }
}
