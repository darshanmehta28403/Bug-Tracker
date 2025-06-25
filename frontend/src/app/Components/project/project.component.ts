import { Component, OnInit } from '@angular/core';
import { BugTrackerService } from '../../bug-tracker.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project',
  imports: [CommonModule, RouterLink],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  projectDetails: any = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private bugTracker: BugTrackerService, private auth: AuthService) {}

  ngOnInit(): void {
    this.bugTracker.getProjects().subscribe((res)=>{
      this.projectDetails = res?.data;
      console.log("User Data: ",this.projectDetails);
    })

    this.isAdmin = this.auth.admin;
    this.auth.isLoggedIn$.subscribe((res)=>{
      this.isLoggedIn = res;
    })
  }

  deleteProject(id: string){
    console.log("Deleting project with ID: ", id);
    this.bugTracker.deleteProject(id).subscribe((res)=>{
      if(res.status>=200 && res.status<300){
        this.bugTracker.openDialogue("Project deleted successfully");
      }
    });
  }
}
