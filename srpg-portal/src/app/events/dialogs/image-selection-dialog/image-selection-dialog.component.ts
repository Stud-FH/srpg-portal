import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventImageService } from '../../event-image.service';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-image-selection-dialog',
  templateUrl: './image-selection-dialog.component.html',
  styleUrls: ['./image-selection-dialog.component.scss']
})
export class ImageSelectionDialogComponent implements OnInit, OnDestroy {

  pageIndex$ = new BehaviorSubject<number>(0);

  page?: string[]

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly dialogRef: MatDialogRef<ImageSelectionDialogComponent>,
    private readonly eventImageService: EventImageService,
  ) {}

  ngOnInit(): void {
    this.pageIndex$.pipe(
      switchMap(pageIndex => this.eventImageService.getImages({pageIndex, pageSize: 8}))
    ).subscribe(page => this.page = page);
  }

  ngOnDestroy(): void {
  }

  navigateBefore() {
    this.pageIndex$.next(this.pageIndex$.value - 1);
  }

  navigateNext() {
    this.pageIndex$.next(this.pageIndex$.value + 1);
  }

  select(image: string) {
    this.dialogRef.close(image);
  }

}
