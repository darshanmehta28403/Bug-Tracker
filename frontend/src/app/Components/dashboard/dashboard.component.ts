import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BugTrackerService } from '../../bug-tracker.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(private bugTrakcer: BugTrackerService) { }

  bugCount: number = 0;
  projectCount: number = 0;
  userCount: number = 0;
  bugDetails: any = {};

  async ngOnInit(): Promise<void> {
    this.bugTrakcer.on('bug-count', (data) => {
      console.log("Bug Count: ", data);
      this.bugCount = data.totalBugs;
      this.bugDetails = data.Bugs;
    })

    this.bugTrakcer.on('project-count', (data) => {
      console.log("Project Count: ", data);
      this.projectCount = data;
    })

    this.bugTrakcer.on('user-count', (data) => {
      console.log("User Count: ", data);
      this.userCount = data;
    })

    this.bugTrakcer.emit('request-initial-data', {});
  }
}
