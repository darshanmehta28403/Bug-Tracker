import { Component, inject, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BugTrackerService } from '../../../bug-tracker.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    NgIf,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  users: any[] = [];
  isUsernameSame: boolean = false;
  regForm: FormGroup;

  constructor(private fb: FormBuilder, private bugTracker: BugTrackerService) {
    this.regForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$'),
        ],
      ],
      username: ['', Validators.required],
      role: [''],
      type: [''],
    });
  }

  ngOnInit(): void {
    this.bugTracker.getUser().subscribe(
      (res: any) => {
        this.users = res.data;

        this.regForm
          .get('username')
          ?.setValidators([
            Validators.required,
            this.duplicateUsernameValidator(this.users),
          ]);

        this.regForm.get('username')?.updateValueAndValidity();
      },
      (error) => {
        console.log("Data couldn't be fetched !!", error);
      }
    );
  }

  duplicateUsernameValidator(users: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const enteredUsername = control.value?.toLowerCase();
      const usernameExists = users.some(
        (user) => user.username?.toLowerCase() === enteredUsername
      );
      return usernameExists ? { usernameTaken: true } : null;
    };
  }

  submitForm() {
    this.regForm.value.designation = "SDE Intern";
    this.regForm.value.role = "intern";
    console.log("Reached:", this.regForm.value);
    this.bugTracker.postUser(this.regForm.value).subscribe((res) => {
      console.log(res.status);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log("reached");
        this.bugTracker.openDialogue("Request Succesfull");
      }
      else {
        this.bugTracker.openDialogue("Request Failed");
      }
    });
  }

}

