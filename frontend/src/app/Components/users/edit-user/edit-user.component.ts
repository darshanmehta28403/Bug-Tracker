import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BugTrackerService } from '../../../bug-tracker.service';
import { AuthService } from '../../../auth.service';
import { UserType } from '../../../userEnums';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatLabel, MatSelect, MatOption, CommonModule],
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  isAdmin = false;
  userId: string | null = null;
  roles = Object.values(UserType);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private service: BugTrackerService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      designation: [''],
      role: ['']
    });

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}').user;
    this.isAdmin = this.auth.isAdmin(currentUser);
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.service.getUserById(this.userId).subscribe(res => {
        const user = res.data;
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          username: user.username,
          designation: user.designation,
          role: user.role
        });
      });
      // If not admin, remove fields
      if (!this.isAdmin) {
        this.userForm.removeControl('designation');
        this.userForm.removeControl('role');
      }
    }
  }

  submit() {
    if (this.userForm.invalid) return;

    const payload = this.userForm.value;
    this.service.updateUser(this.userId!, payload).subscribe({
      next: () => {
        this.service.openDialogue('User updated successfully');
      },
      error: (err) => {
        console.log(err);
        this.service.openDialogue(err.error.message);
        console.error(err);
      }
    });
  }
}
