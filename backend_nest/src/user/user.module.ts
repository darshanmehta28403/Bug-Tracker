import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepoService } from './user.repo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), JwtModule.register({
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
  })],
  controllers: [UserController],
  providers: [UserService, UserRepoService],
})
export class UserModule { }
