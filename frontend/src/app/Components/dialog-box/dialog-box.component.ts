import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  imports: [MatDialogModule],
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { msg: string }
  ) {}
}
