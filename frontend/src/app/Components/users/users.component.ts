import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BugTrackerService } from '../../bug-tracker.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isAdmin: boolean = false;

  constructor(private bugTrackerService: BugTrackerService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.bugTrackerService.getUser().subscribe((res) => {
      this.users = res.data.users;
    });
  }
}
