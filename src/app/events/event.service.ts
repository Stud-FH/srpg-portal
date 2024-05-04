import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, of, switchMap, timer } from 'rxjs';
import { SrpgEvent, SrpgEventRecurrence } from './domain/event';
import { UserService } from '../users/user.service';
import { MockEvents } from './mock-events';
import { doNotificationSettingsApply } from '../users/domain/user-settings';

const mockGameSystems = [
  'Dungeons & Dragons 5e',
  'Pathfinder 2e',
  'Call of Cthulu',
  'Blades in the Dark',
];

@Injectable({
  providedIn: 'root',
})
export class EventService {
  events: { [id: number]: SrpgEvent } = Object.fromEntries(
    MockEvents.map((e) => [e.id, e])
  );

  constructor(private readonly userService: UserService) {}

  getEvents(): Observable<SrpgEvent[]> {
    return timer(500).pipe(
      switchMap(() => of(Object.values(this.events))),
      map((events) => events.map((event) => ({ ...event })))
    );
  }

  getEvent(id: number): Observable<SrpgEvent> {
    return timer(500).pipe(
      switchMap(() => of(this.events[id])),
      map((event) => ({ ...event }))
    );
  }

  getGameSystems(filter: string): Observable<string[]> {
    return timer(500).pipe(
      switchMap(() => of(mockGameSystems.filter((s) => s.includes(filter)))),
      map((values) => [...values])
    );
  }

  createEvent(event: SrpgEvent): Observable<SrpgEvent> {
    return timer(500).pipe(
      switchMap(() => {
        const id = Math.max(...Object.values(this.events).map((e) => e.id)) + 1;
        const newEvent = { ...event, id };
        this.events[id] = newEvent;
        this.notifyUsers(newEvent);
        return of({ ...newEvent });
      })
    );
  }

  private async notifyUsers(re: SrpgEvent) {
    const event = this.events[re.id];
    const users = await lastValueFrom(this.userService.getUsers());

    users
      .filter((user) => re.participantIds.includes(user.id))
      .forEach(async (user) => {
        await lastValueFrom(
          this.userService.notifyUser(
            user.id,
            `You have been added to ${event.title}`,
            ['/event', event.id]
          )
        );
      });

    users
      .filter((user) => !re.participantIds.includes(user.id))
      .filter((user) => doNotificationSettingsApply(user, event))
      .forEach(async (user) => {
        await lastValueFrom(
          this.userService.notifyUser(
            user.id,
            `Upcoming ${event.type}: ${event.title}`,
            ['/event', event.id]
          )
        );
      });
  }

  updateEvent(
    id: number,
    update?: (event: SrpgEvent) => void
  ): Observable<SrpgEvent> {
    return this.getEvent(id).pipe(
      switchMap((event) => {
        if (!event) {
          throw new Error('User not found');
        }
        if (event != null && update != null) {
          update(event);
        }
        this.events[id] = event;
        return of({ ...event });
      })
    );
  }
}
