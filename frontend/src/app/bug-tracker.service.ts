import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './Components/dialog-box/dialog-box.component';
@Injectable({
  providedIn: 'root',
})
export class BugTrackerService {
  readonly dialog = inject(MatDialog);

  // user and login
  private getUserDataUrl = 'http://localhost:5557/api/user/';
  private postUserDataUrl = 'http://localhost:5557/api/user';
  private loginUserDataUrl = 'http://localhost:5557/api/user/login';

  //project
  private getProjectDataUrl = 'http://localhost:5557/api/projects/';
  private deleteProjectUrl = 'http://localhost:5557/api/projects/{id}';
  private postProjectUrl = 'http://localhost:5557/api/projects';

  constructor(private http: HttpClient) { }

  openDialogue(msg: string) {
    this.dialog.open(DialogBoxComponent, {
      width: '500px',
      data: { msg },
    });
  }

  getUser(): Observable<any> {
    return this.http.get<any>(this.getUserDataUrl);
  }

  postUser(userData: {}): Observable<any> {
    return this.http.post<any>(this.postUserDataUrl, userData);
  }

  loginAuth(userData: {}): Observable<any> {
    return this.http.post<any>(this.loginUserDataUrl, userData);
  }

  getProjects(): Observable<any> {
    return this.http.get<any>(this.getProjectDataUrl);
  }

  deleteProject(id: string): Observable<any> {
    console.log('Deleting project with ID in service: ', id);
    const url = this.deleteProjectUrl.replace('{id}', id);
    return this.http.delete<any>(url);
  }

  postProject(projectData: {}): Observable<any> {
    return this.http.post<any>(this.postProjectUrl, projectData);
  }

  getProjectById(id: string): Observable<any> {
    const url = this.deleteProjectUrl.replace('{id}', id);
    return this.http.get<any>(url);
  }
}
