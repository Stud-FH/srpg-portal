import { Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { CreateEventComponent } from './pages/create-event/create-event.component';

export const EventRoutes: Routes = [
  {
    path: 'upcoming',
    title: 'Upcoming',
    component: EventListComponent,
  },
  {
    path: 'create-event',
    component: CreateEventComponent,
  },
  {
    path: 'event/:id',
    component: EventDetailsComponent,
  },
];
