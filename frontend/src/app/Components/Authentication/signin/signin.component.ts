import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { BugTrackerService } from '../../../bug-tracker.service';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    NgIf,
    MatButtonModule,
    RouterModule
],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  loginForm: FormGroup;
  loginError: boolean = false;

  constructor(private fb: FormBuilder, private bugTracker: BugTrackerService, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._@-]{3,30}$')]],
      password: ['',
        [
          Validators.required,
        ],
      ],
    });
  }

  onSubmit() {
    const data = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }
    this.bugTracker.loginAuth(data).subscribe((res)=>{
      if(res.status>=200 && res.status<300){
        this.auth.login(res.data.user);
        this.router.navigate(['']);
      }
    })
  }
}
