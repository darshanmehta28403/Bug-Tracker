import { Component, OnInit } from '@angular/core';
import { BugTrackerService } from '../../bug-tracker.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-bugs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.scss']
})
export class BugsComponent implements OnInit {
  bugs: any[] = [];
  isAdmin: boolean = false;

  constructor(private bugService: BugTrackerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.admin;
    this.bugService.getBugs().subscribe((res: any) => {
      this.bugs = res?.data?.Bugs || [];
    });
  }

  deleteProject(bugId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.bugService.deleteBug(bugId).subscribe(() => {
        this.bugs = this.bugs.filter(p => p.id !== bugId);
      });
    }
  }
}
