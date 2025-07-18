import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './Components/dialog-box/dialog-box.component';
import { ApiRoutes } from './../ApiRoutes';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class BugTrackerService {
  readonly dialog = inject(MatDialog);
  private baseUrl = 'http://localhost:5557';
  private socket: Socket;
  isSocketConnected = false; // <-- add flag

  constructor(private http: HttpClient) {
    this.socket = io(this.baseUrl);

    this.socket.on('connect', () => {
      console.log('Socket connected with ID:', this.socket.id);
      this.isSocketConnected = true;
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }


  openDialogue(msg: string) {
    this.dialog.open(DialogBoxComponent, {
      width: '500px',
      data: { msg },
    });
  }

  // ===== USER =====
  getUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${ApiRoutes.GET_USERS}`);
  }

  postUser(userData: {}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${ApiRoutes.CREATE_USER}`, userData);
  }

  sendMail(userData: {}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${ApiRoutes.SEND_MAIL}`, userData);
  }

  loginAuth(userData: {}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${ApiRoutes.LOGIN_USER}`, userData);
  }

  getUserById(id: string): Observable<any> {
    const url = ApiRoutes.GET_USER_BY_ID.replace(':id', id);
    return this.http.get<any>(`${this.baseUrl}${url}`);
  }

  updateUser(id: string, payload: any): Observable<any> {
    const url = ApiRoutes.UPDATE_USER.replace(':id', id);
    return this.http.patch<any>(`${this.baseUrl}${url}`, payload);
  }

  updatePassword(id: string, payload: any): Observable<any> {
    const url = ApiRoutes.UPDATE_PASSWORD.replace(':id', id);
    return this.http.patch<any>(`${this.baseUrl}${url}`, payload);
  }

  deleteUser(id: string): Observable<any> {
    const url = ApiRoutes.DELETE_USER.replace(':id', id);
    return this.http.delete<any>(`${this.baseUrl}${url}`);
  }

  // ===== PROJECT =====
  getProjects(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${ApiRoutes.GET_PROJECTS}`);
  }

  postProject(projectData: {}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${ApiRoutes.CREATE_PROJECT}`, projectData);
  }

  getProjectById(id: string): Observable<any> {
    const url = ApiRoutes.GET_PROJECT_BY_ID.replace(':id', id);
    return this.http.get<any>(`${this.baseUrl}${url}`);
  }

  deleteProjectMember(pid: string, mid: string): Observable<any> {
    const url = ApiRoutes.DELETE_PROJECT_MEMBER.replace(':projectId', pid);
    return this.http.delete<any>(`${this.baseUrl}${url.replace(':memberId', mid)}`);
  }

  deleteProject(id: string): Observable<any> {
    const url = ApiRoutes.DELETE_PROJECT.replace(':id', id);
    return this.http.delete<any>(`${this.baseUrl}${url}`);
  }

  updateProject(id: string, payload: any): Observable<any> {
    const url = ApiRoutes.UPDATE_PROJECT.replace(':id', id);
    return this.http.patch<any>(`${this.baseUrl}${url}`, payload);
  }

  // ===== BUG =====
  getBugs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${ApiRoutes.GET_BUGS}`);
  }

  getBugById(id: string): Observable<any> {
    const url = ApiRoutes.GET_BUG_BY_ID.replace(':id', id);
    return this.http.get<any>(`${this.baseUrl}${url}`);
  }

  updateBug(id: string, payload: any): Observable<any> {
    const url = ApiRoutes.UPDATE_BUG.replace(':id', id);
    return this.http.patch<any>(`${this.baseUrl}${url}`, payload);
  }

  createBug(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${ApiRoutes.CREATE_BUG}`, payload);
  }

  deleteBug(id: any): Observable<any> {
    const url = ApiRoutes.DELETE_BUG.replace(':id', id);
    return this.http.delete<any>(`${this.baseUrl}${url}`);
  }

  // ===== COMMENT =====
  getComment(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${ApiRoutes.GET_COMMENTS}`);
  }

  addComment(comment: any): Observable<any> { // Assuming bugId is passed in path
    return this.http.post<any>(`${this.baseUrl}${ApiRoutes.COMMENT_BASE}`, comment);
  }

  editComment(commentId: string, comment: any): Observable<any> {
    const url = ApiRoutes.UPDATE_COMMENT.replace(':id', commentId);
    return this.http.patch<any>(`${this.baseUrl}${url}`, comment);
  }

  deleteComment(commentId: string): Observable<any> {
    const url = ApiRoutes.DELETE_COMMENT.replace(':id', commentId);
    return this.http.delete<any>(`${this.baseUrl}${url}`);
  }
}
