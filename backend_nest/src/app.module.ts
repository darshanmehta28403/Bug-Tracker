import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { BugModule } from './bug/bug.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [UserModule, ProjectModule, BugModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
