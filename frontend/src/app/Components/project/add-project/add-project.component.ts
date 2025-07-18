import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BugTrackerService } from '../../../bug-tracker.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  projectId: string | null = null;
  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private bugTracker: BugTrackerService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      members: [''],
      createdBy: [JSON.parse(localStorage.getItem('user') ?? '{}').user.id]
    });
  }

  ngOnInit(): void {
    // Get users
    this.bugTracker.getUser().subscribe((res) => {
      this.userData = res?.data.users;
    });

    // Check if this is edit mode
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEdit = true;
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: string) {
    this.bugTracker.getProjectById(id).subscribe((res) => {
      const p = res.data;

      this.projectForm.patchValue({
        name: p.name,
        description: p.description,
        members: p.members.map((m: any) => m.id),
        createdBy: p.createdBy?.id || ''
      });
    });
  }

  onSubmit() {
    const formData = this.projectForm.value;

    if (this.isEdit && this.projectId) {
      console.log("FormData: ", formData);
      this.bugTracker.updateProject(this.projectId, formData).subscribe(() => {
        this.bugTracker.openDialogue("Project Updated Successfully !!");
        this.router.navigate(['/projects']);
      });
    } else {
      this.bugTracker.postProject(formData).subscribe((res) => {
        if (res.status >= 200 && res.status < 300) {
          this.bugTracker.openDialogue("Project Created Successfully !!");
          this.router.navigate(['/projects']);
        }
      });
    }
  }
}

