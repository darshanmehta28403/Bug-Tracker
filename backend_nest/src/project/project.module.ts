import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepoService } from './project.repo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]), JwtModule.register({
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
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepoService],
})
export class ProjectModule { }
