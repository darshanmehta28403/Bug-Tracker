import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BugTrackerService } from '../../../bug-tracker.service';
import { CommonModule, NgFor } from '@angular/common';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-view-project',
  imports: [CommonModule, NgFor],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.scss'
})
export class ViewProjectComponent implements OnInit {

  projectDetails: any;
  isAdmin?: boolean;

  constructor(private route: ActivatedRoute, private bugTracker: BugTrackerService, private auth: AuthService) { }

  ngOnInit(): void {
    console.log("ProjectId: ", this.route.snapshot.paramMap.get('id'));
    this.bugTracker.getProjectById(this.route.snapshot.paramMap.get('id')!).subscribe((res) => {
      this.projectDetails = res.data;
    });
    this.isAdmin = this.auth.admin;
  }
}
