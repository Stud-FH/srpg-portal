import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../domain/user';
import { AboutMeDialogComponent } from '../about-me-dialog/about-me-dialog.component';

@Component({
  selector: 'app-start-conversation-dialog',
  templateUrl: './start-conversation-dialog.component.html',
  styleUrls: ['./start-conversation-dialog.component.scss']
})
export class StartConversationDialogComponent {
  user = this.data;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private readonly dialogRef: MatDialogRef<AboutMeDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

}
