import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepo } from './ProjectRepo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/jwt.strategy';
import { forwardRef } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    forwardRef(() => ChatModule),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
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
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepo, JwtStrategy],
  exports: [ProjectService]
})
export class ProjectModule { }