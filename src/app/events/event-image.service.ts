import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { MockEventImages } from './mock-event-images';

@Injectable({
  providedIn: 'root',
})
export class EventImageService {
  constructor() {}

  getImages(queryParams: {
    pageSize: number;
    pageIndex: number;
  }): Observable<string[]> {
    const startIndex = queryParams.pageIndex * queryParams.pageSize;
    const endIndex = startIndex + queryParams.pageSize;
    return timer(300).pipe(
      switchMap(() => of(MockEventImages.slice(startIndex, endIndex)))
    );
  }
}
