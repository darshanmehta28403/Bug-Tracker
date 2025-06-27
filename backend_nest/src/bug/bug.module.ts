import { Module } from '@nestjs/common';
import { BugService } from './bug.service';
import { BugController } from './bug.controller';
import { BugRepoService } from './bug.repo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bug, BugSchema } from './bug.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [BugService, BugRepoService],
})
export class BugModule { }
