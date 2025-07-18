import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepo } from './UserRepo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/jwt.strategy';
import { forwardRef } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    forwardRef(() => ChatModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // valid for 7 days
    }),
    ConfigModule.forRoot({ isGlobal: true }), // <-- Loads `.env`
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepo, JwtStrategy],
  exports: [UserService]
})
export class UserModule { }