import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-configure-calendar-sync-dialog',
  templateUrl: './configure-calendar-sync-dialog.component.html',
  styleUrls: ['./configure-calendar-sync-dialog.component.scss'],
})
export class ConfigureCalendarSyncDialogComponent {
  connecting = false;
  connected = false;
  constructor(
    private readonly dialogRef: MatDialogRef<ConfigureCalendarSyncDialogComponent>
  ) {}

  async connect() {
    this.connecting = true;
    await lastValueFrom(timer(2500));
    this.connected = true;
    this.connecting = false;
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  submit() {
    this.dialogRef.close(true);
  }
}
