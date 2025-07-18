import { Component, OnInit } from '@angular/core';
import { BugTrackerService } from '../../bug-tracker.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-project',
  imports: [CommonModule, RouterLink, MatTableModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  projects: any[] = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private projectService: BugTrackerService, private authService: AuthService) { }

  ngOnInit(): void {

    this.isAdmin = this.authService.admin;
    console.log("isAdmin", this.isAdmin);
    this.projectService.getProjects().subscribe((res) => {
      this.projects = res.data.projects;
    });

    this.authService.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res;
    })
  }

  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe(() => {
        this.projects = this.projects.filter(p => p.id !== projectId);
      });
    }
  }
}
