import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BugTrackerService } from '../../../bug-tracker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Severity, Status } from '../bugEnums';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-bug',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './add-bug.component.html',
  styleUrls: ['./add-bug.component.scss']
})
export class AddBugComponent implements OnInit {
  bugForm: FormGroup;
  isEdit = false;
  bugId: string | null = null;
  severities = Object.values(Severity);
  statuses = Object.values(Status);
  Status = Status;

  projects: any[] = []; // Load projects from service
  members: any[] = []; // Members of selected project

  constructor(
    private fb: FormBuilder,
    private service: BugTrackerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bugForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      severity: [Severity.LOW, Validators.required],
      status: [{ value: Status.OPEN, disabled: true }, Validators.required],
      project: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.bugId = this.route.snapshot.paramMap.get('id');

    if (this.bugId) {
      this.isEdit = true;

      this.bugForm.get('status')?.enable();

      this.service.getBugById(this.bugId).subscribe(res => {
        const b = res.data;
        this.bugForm.patchValue({
          title: b.title,
          description: b.description,
          severity: b.severity,
          status: b.status,
          project: b.project.id
        });
        this.loadMembers(b.project.id);
      });
    }

    if (!this.isEdit) {
      this.bugForm.patchValue({ status: Status.OPEN });
    }

    this.service.getProjects().subscribe(res => {
      this.projects = res.data.projects || [];
    });
  }



  loadMembers(projectId: string) {
    // fetch project and extract members
    this.service.getProjectById(projectId).subscribe(res => {
      this.members = res.data.members || [];
    });
  }

  submit() {
    if (this.bugForm.invalid) return;

    const payload = {
      ...this.bugForm.value,
      reportedBy: JSON.parse(localStorage.getItem('user')!).user.id
    };

    if (this.isEdit && this.bugId) {
      console.log("bugId for update: ", this.bugId)
      this.service.updateBug(this.bugId, payload).subscribe(() => {
        this.service.openDialogue('Bug updated successfully');
        this.router.navigate(['/bugs']);
      });
    } else {
      const payload = {
        ...this.bugForm.getRawValue(),
        reportedBy: JSON.parse(localStorage.getItem('user')!).user.id
      };
      this.service.createBug(payload).subscribe(() => {
        this.service.openDialogue('Bug created successfully');
        this.router.navigate(['/bugs']);
      });
    }
  }
}
