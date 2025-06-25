import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userDetails: any;

  ngOnInit(): void {
    this.auth.user$.subscribe((res)=>{
      this.userDetails = res;
    });
    console.log('User Details from router state: ', this.userDetails);
  }

  constructor(private router: Router, private auth: AuthService) {}

  logout(){
    this.auth.logout();
    this.router.navigate(['']);
  }

}
