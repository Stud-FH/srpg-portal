import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  lastValueFrom,
  map,
  of,
  switchMap,
} from 'rxjs';
import { parseNumber } from 'src/app/shared/util';
import { EventService } from '../../event.service';
import { SrpgEvent, availableSlots } from '../../domain/event';
import { CurrentUserService } from 'src/app/users/current-user.service';
import { User } from 'src/app/users/domain/user';
import { MatDialog } from '@angular/material/dialog';
import { AboutMeDialogComponent } from 'src/app/users/dialogs/about-me-dialog/about-me-dialog.component';
import { StartConversationDialogComponent } from 'src/app/users/dialogs/start-conversation-dialog/start-conversation-dialog.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  currentUser$ = this.currentUserService.currentUser$;

  event$ = new Subject<SrpgEvent>();

  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly eventService: EventService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params
      .pipe(
        map((params) => parseNumber(params['id'])),
        switchMap((id) => {
          if (id == null) {
            throw new Error('Invalid url');
          } else {
            return this.eventService.getEvent(id);
          }
        }),
        catchError((error) => {
          this.router.navigate(['upcoming']);
          throw error;
        })
      )
      .subscribe(this.event$);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  imageStyle(event: SrpgEvent) {
    return {
      'background-image': `url(${event.imageUrl})`,
    };
  }

  isSelf(user: User) {
    return this.currentUserService.currentUserId === user.id;
  }

  participationStatus(user: User | null, event: SrpgEvent) {
    if (user == null) {
      return 'loading';
    } else if (event.participantIds.includes(user.id)) {
      return 'joined';
    } else if (event.waitingListIds.includes(user.id)) {
      return 'waiting';
    } else if (availableSlots(event) > 0) {
      return 'available';
    } else {
      return 'full';
    }
  }

  availableSlots(event: SrpgEvent): number {
    return availableSlots(event);
  }

  async openAboutMe(user: User) {
    const ref = this.matDialog.open(AboutMeDialogComponent, { data: user });
    await lastValueFrom(ref.afterClosed());
  }

  async openConversation(user: User) {
    const ref = this.matDialog.open(StartConversationDialogComponent, { data: user });
    await lastValueFrom(ref.afterClosed());
  }

  async leave(user: User, event: SrpgEvent) {
    const updated = await lastValueFrom(
      this.eventService.updateEvent(event.id, (e) => {
        e.participantIds = e.participantIds.filter((id) => id !== user.id);
      })
    );
    this.event$.next(updated);
  }

  async leaveWaitingList(user: User, event: SrpgEvent) {
    const updated = await lastValueFrom(
      this.eventService.updateEvent(event.id, (e) => {
        e.waitingListIds = e.waitingListIds.filter((id) => id !== user.id);
      })
    );
    this.event$.next(updated);
  }

  async join(user: User, event: SrpgEvent) {
    const updated = await lastValueFrom(
      this.eventService.updateEvent(event.id, (e) => {
        e.participantIds = [...e.participantIds, user.id];
      })
    );
    this.event$.next(updated);
  }

  async joinWaitingList(user: User, event: SrpgEvent) {
    const updated = await lastValueFrom(
      this.eventService.updateEvent(event.id, (e) => {
        e.waitingListIds = [...e.waitingListIds, user.id];
      })
    );
    this.event$.next(updated);
  }

  private async update(event: SrpgEvent, update: (e: SrpgEvent) => void) {
    const updated = await lastValueFrom(
      this.eventService.updateEvent(event.id, update)
    );
    this.event$.next(updated);
  }
}
