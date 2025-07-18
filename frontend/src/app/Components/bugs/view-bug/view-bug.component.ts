import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BugTrackerService } from '../../../bug-tracker.service';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    MatCard,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink
  ],
  selector: 'app-view-bug',
  templateUrl: './view-bug.component.html',
  styleUrls: ['./view-bug.component.scss']
})
export class ViewBugComponent implements OnInit {
  bug: any;
  comments: any[] = [];
  currentUser: any;
  isAdmin: boolean = false;

  commentForm: FormGroup;
  editingCommentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bugService: BugTrackerService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const bugId = this.route.snapshot.paramMap.get('id')!;
    const stored = localStorage.getItem('user');
    this.currentUser = stored ? JSON.parse(stored).user : null;
    this.isAdmin = this.authService.admin;

    this.loadBug(bugId);
    this.loadComments(bugId);
  }

  loadBug(bugId: string) {
    this.bugService.getBugById(bugId).subscribe(res => {
      this.bug = res.data;
    });
  }

  loadComments(bugId: string) {
    this.bugService.getComment().subscribe(res => {
      this.comments = res.data.Comments.filter((c: any) => {
        return c.bug === bugId;
      });
    });
  }

  submitComment() {
    const text = this.commentForm.value.text.trim();
    if (!text || !this.bug || !this.currentUser) return;

    const payload = {
      text,
      author: this.currentUser.id,
      bug: this.bug.id,
      project: this.bug.project?.id
    };

    if (this.editingCommentId) {
      this.bugService.editComment(this.editingCommentId, { text }).subscribe(() => {
        const index = this.comments.findIndex(c => c._id === this.editingCommentId);
        if (index !== -1) {
          this.comments[index].text = text;
        }
        this.cancelEdit();
      });
    } else {
      this.bugService.addComment(payload).subscribe((res: any) => {
        this.comments.unshift(res.data); // new comment on top
        this.commentForm.reset();
      });
    }
  }

  canEditOrDeleteComment(comment: any): boolean {
    return this.isAdmin || comment.author.id === this.currentUser?.id;
  }

  editComment(comment: any): void {
    this.editingCommentId = comment.id;
    this.commentForm.patchValue({ text: comment.text });
  }

  deleteComment(comment: any): void {
    this.bugService.deleteComment(comment.id).subscribe(() => {
      this.comments = this.comments.filter(c => c.id !== comment.id);
    });
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.commentForm.reset();
  }
}
