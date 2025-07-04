import { Module } from '@nestjs/common';
import { BugService } from './bug.service';
import { BugController } from './bug.controller';
import { BugRepo } from './BugRepo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Bug, BugSchema } from './bug.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bug.name, schema: BugSchema }]), JwtModule.register({
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
  controllers: [BugController],
  providers: [BugService, BugRepo, JwtStrategy],
})
export class BugModule { }