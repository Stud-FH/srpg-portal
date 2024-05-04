import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../../event.service';
import { Subscription } from 'rxjs';
import { SrpgEvent, availableSlots } from '../../domain/event';
import { AppContextService } from 'src/app/shared/app-context.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  events?: SrpgEvent[];

  constructor(
    private readonly appContextService: AppContextService,
    private readonly eventService: EventService
  ) {}

  ngOnInit(): void {
    const sub = this.eventService
      .getEvents()
      .subscribe((events) => (this.events = events));
    this.subscription.add(sub);

    this.appContextService.registerPageContext({
      navEscape: { icon: 'account_circle', routerLink: ['profile'] },
      navConfigure: {
        icon: 'circle_notifications',
        routerLink: ['notifications'],
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  imageStyle(event: SrpgEvent) {
    return {
      'background-image': `url(${event.imageUrl})`,
    };
  }

  availableSlots(event: SrpgEvent) {
    return availableSlots(event);
  }
}
