import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../domain/user';

@Component({
  selector: 'app-about-me-dialog',
  templateUrl: './about-me-dialog.component.html',
  styleUrls: ['./about-me-dialog.component.scss'],
})
export class AboutMeDialogComponent {
  user = this.data;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private readonly dialogRef: MatDialogRef<AboutMeDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
