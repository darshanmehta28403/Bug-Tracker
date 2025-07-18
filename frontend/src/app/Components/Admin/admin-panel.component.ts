import { Component, OnInit } from '@angular/core';
import { BugTrackerService } from '../../bug-tracker.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatCardModule, CommonModule]
})
export class AdminPanelComponent implements OnInit {
  users: any[] = [];

  constructor(private service: BugTrackerService, private router: Router) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getUser().subscribe(res => {
      this.users = res?.data?.users || [];
    });
  }

  editUser(user: any) {
    this.router.navigate(['/editUser', user.id]); // you can change route
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.service.deleteUser(userId).subscribe(() => {
        this.service.openDialogue('User deleted successfully');
        this.loadUsers(); // refresh table
      });
    }
  }
}
