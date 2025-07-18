import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BugTrackerService } from '../../../bug-tracker.service';
import { AuthService } from '../../../auth.service';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-view-project',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterLink,
    MatTableModule
  ],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.scss'
})
export class ViewProjectComponent implements OnInit {
  project: any;
  bugs: any[] = [];
  isAdmin?: boolean;
  displayedColumns: string[] = ['title', 'status', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private bugService: BugTrackerService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id')!;
    this.isAdmin = this.auth.admin;

    // Fetch project
    this.bugService.getProjectById(projectId).subscribe((res) => {
      this.project = res.data;
    });

    // Fetch only bugs of this project
    this.bugService.getBugs().subscribe((res: any) => {
      this.bugs = res.data.Bugs.filter((bug: any) => bug.project?.id === projectId);
    });
  }

  removeMember(memberId: string) {
    if (!this.project?.id) return;
    this.bugService.deleteProjectMember(this.project.id, memberId).subscribe(() => {
      this.project.members = this.project.members.filter((m: any) => m._id !== memberId);
    });
  }
}
