import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userDetails: any;

  ngOnInit(): void {
    this.auth.user$.subscribe((res) => {
      this.userDetails = res.user;
    });
    console.log('User Details from router state: ', this.userDetails);
  }

  constructor(private router: Router, private auth: AuthService) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }

}
