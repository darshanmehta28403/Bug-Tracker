import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BugService } from 'src/bug/bug.service';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { Inject, OnModuleInit, forwardRef } from '@nestjs/common';
import { AppEventEmitter } from 'src/event.emitter.provider';

@WebSocketGateway({ cors: { origin: 'http://localhost:4200' } })
export class BugTrackerGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private bugService: BugService,
    private projectService: ProjectService,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) { }

  async onModuleInit() {
    AppEventEmitter.on('broadcast-counts', () => {
      this.broadcastCounts();
    });
  }

  @SubscribeMessage('request-initial-data')
  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    const bugData = await this.bugService.findAllBugs({ page: 0, limit: 0 });
    const projectData = await this.projectService.findAllProjects({ page: 0, limit: 0 });
    const userData = await this.userService.findAllUsers({ page: 0, limit: 0 });
    client.emit('bug-count', bugData);
    client.emit('project-count', projectData.totalprojects);
    client.emit('user-count', userData.totalUsers);
  }

  async broadcastCounts() {
    const bugData = await this.bugService.findAllBugs({ page: 0, limit: 0 });
    const projectData = await this.projectService.findAllProjects({ page: 0, limit: 0 });
    const userData = await this.userService.findAllUsers({ page: 0, limit: 0 });
    this.server.emit('bug-count', bugData);
    this.server.emit('project-count', projectData.totalprojects);
    this.server.emit('user-count', userData.totalUsers);
  }

}
