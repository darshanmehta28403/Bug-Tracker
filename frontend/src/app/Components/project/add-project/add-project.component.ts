import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  Form,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BugTrackerService } from '../../../bug-tracker.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-add-project',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    // MatOption,
    CommonModule,
    NgIf,
    MatSelectModule
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss',
})
export class AddProjectComponent implements OnInit {
  projectForm: FormGroup;

  userData: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private bugTracker: BugTrackerService,
    private auth: AuthService
  ) {
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      members: [''],
      createdBy: [JSON.parse(localStorage.getItem('user') ?? '{}')._id]
    });
  }

  ngOnInit(): void {
    this.bugTracker.getUser().subscribe((res) => {
      this.userData = res?.data;
    });
  }

  onSubmit() {
    console.log("Project value: ",this.projectForm.value);
    this.bugTracker.postProject(this.projectForm.value).subscribe((res)=>{
      if(res.status>=200 && res.status<300){
        this.bugTracker.openDialogue("Project Created Successfully !!");
      } 
    })
  }
}
