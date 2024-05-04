import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SrpgEventInterest } from '../../domain/user-settings';
import { FormBuilder, FormControl } from '@angular/forms';
import { SrpgEventType } from 'src/app/events/domain/event';

@Component({
  selector: 'app-interest-dialog',
  templateUrl: './interest-dialog.component.html',
  styleUrls: ['./interest-dialog.component.scss'],
})
export class InterestDialogComponent {
  readonly enabled = new FormControl<boolean>(this.data.enabled);
  readonly type = new FormControl<SrpgEventType | null>(this.data.type);
  readonly activityOrGameSystem = new FormControl<string | null>(
    this.data.activityOrGameSystem
  );

  readonly interest = this.formBuilder.group({
    enabled: this.enabled,
    type: this.type,
    activityOrGameSystem: this.activityOrGameSystem,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SrpgEventInterest,
    private readonly dialogRef: MatDialogRef<InterestDialogComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  discard() {
    this.dialogRef.close(undefined);
  }

  submit() {
    this.dialogRef.close(this.interest.value);
  }
}
