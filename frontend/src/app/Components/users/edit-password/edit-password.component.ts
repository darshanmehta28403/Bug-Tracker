import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { BugTrackerService } from '../../../bug-tracker.service';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.scss'
})
export class EditPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private service: BugTrackerService,
    private route: ActivatedRoute
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords('password', 'confirmPassword') });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.userId) {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      this.userId = user?.user?.id;
    }
  }

  matchPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordKey)?.value;
      const confirm = group.get(confirmPasswordKey)?.value;
      return password === confirm ? null : { passwordMismatch: true };
    };
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    const payload = {
      password: this.passwordForm.value.password
    };

    this.service.updatePassword(this.userId, payload).subscribe({
      next: () => this.service.openDialogue('Password updated successfully!'),
      error: () => this.service.openDialogue('Failed to update password.')
    });
  }
}


