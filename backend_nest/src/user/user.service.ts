import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { hashPassword, comparePassword } from './user.util';
import { PaginationDto } from './dto/pagination.dto';
import { UserRepo } from './UserRepo.repository';
import * as nodemailer from 'nodemailer';
import { AppEventEmitter } from '../event.emitter.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepo,
    private jwtService: JwtService,
  ) { }

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

  async findAllUsers(query: PaginationDto): Promise<any> {
    try {
      const result = await this.repo.findAllPaginated(query);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch users');
    }
  }

  async createUser(user: CreateUserDto): Promise<any> {
    try {
      user.password = await hashPassword(user.password);
      const { username } = user;
      const validUsername = await this.repo.findOne({ username });
      const { email } = user;
      const validEmail = await this.repo.findOne({ email });
      if (validEmail) {
        throw new NotAcceptableException('Email Already Exists !!')
      }
      if (validUsername) {
        throw new NotAcceptableException('Username Already Exists !!')
      }
      const created = await this.repo.create(user);
      AppEventEmitter.emit('broadcast-counts');
      return created;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'User creation failed');
    }
  }

  async updateUser(id: string, updatedData: UpdateUserDto): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    if (updatedData.password) {
      updatedData.password = await hashPassword(updatedData.password);
    }
    const { username } = updatedData;
    const validUsername = await this.repo.findOne({ username });
    const { email } = updatedData;
    const validEmail = await this.repo.findOne({ email });
    if (validEmail) {
      if (validEmail.id !== id) {
        throw new NotAcceptableException('Email Already Exists !!')
      }
    }
    if (validUsername) {
      if (validUsername.id !== id) {
        throw new NotAcceptableException('Username Already Exists !!')
      }
    }
    const updated = await this.repo.update(id, updatedData);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    AppEventEmitter.emit('broadcast-counts');
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
    AppEventEmitter.emit('broadcast-counts');
    return deleted;
  }

  async login(userData: LoginUserDto): Promise<any> {
    const { username, password } = userData;
    const user = await this.repo.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const pass = await comparePassword(password, user.password);
    if (!pass) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const access_token = this.jwtService.sign(
      { username: user.username, _id: user._id, role: user.role },
      { secret: process.env.JWT_SECRET }
    );
    return { user, access_token };
  }

  async sendMail(username: any) {
    const user = await this.repo.findOne({ username });
    if (!user) {
      throw new NotFoundException('Username Not Found !!');
    }
    const id = user.id;
    const link = `http://localhost:4200/editPassword/${id}`
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'darshanm28403@gmail.com',
        pass: 'uslh knrw avip tvqf'
      },
      tls: {
        rejectUnauthorized: false, // <-- Accept self-signed certs
      },
    });
    const mailOptions = {
      from: '"Bug Tracker" darshanm28403@gmail.com',
      to: 'playstation1to5@gmail.com',
      subject: 'Reset Your Password',
      html: `
        <p>Hello 👋,</p>
        <p>You requested a password reset.</p>
        <p><a href="${link}" target="_blank">Click here to reset password</a></p>
        <p>This link is valid for 15 minutes.</p>
      `,
    };
    return await transporter.sendMail(mailOptions);
  }

  async updatePassword(id: any, updatedData: any) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    if (updatedData.password) {
      updatedData.password = await hashPassword(updatedData.password);
    }
    const updated = await this.repo.update(id, updatedData);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }
}
