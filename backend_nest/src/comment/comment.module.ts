import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepoService } from './comment.repo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), JwtModule.register({
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
  controllers: [CommentController],
  providers: [CommentService, CommentRepoService],
})
export class CommentModule { }

