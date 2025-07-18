import { Module, forwardRef } from '@nestjs/common';
import { BugTrackerGateway } from './bugtracker.gateway';
import { BugModule } from 'src/bug/bug.module';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => BugModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => UserModule)
  ],
  providers: [BugTrackerGateway],
  exports: [BugTrackerGateway]
})
export class ChatModule { }
