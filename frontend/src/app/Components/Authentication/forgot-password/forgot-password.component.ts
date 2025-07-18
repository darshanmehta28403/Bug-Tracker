import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BugTrackerService } from '../../../bug-tracker.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder, private service: BugTrackerService) {
    this.forgotForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    const payload = { username: this.forgotForm.value.username };

    this.service.sendMail(payload).subscribe({
      next: () => {
        this.service.openDialogue('Password reset mail sent successfully!');
      },
      error: (err) => {
        this.service.openDialogue(err.error.message);
      }
    });
  }
}
