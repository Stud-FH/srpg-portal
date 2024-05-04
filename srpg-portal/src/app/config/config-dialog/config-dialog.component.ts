import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss'],
})
export class ConfigDialogComponent {
  constructor(private readonly dialog: MatDialogRef<ConfigDialogComponent>) {}

  close() {
    this.dialog.close();
  }
}
