import { Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { InboxPageComponent } from './pages/inbox-page/inbox-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

export const UserRoutes: Routes = [
  {
    path: 'notifications',
    title: 'Notifications',
    component: NotificationsComponent,
  },
  {
    path: 'inbox',
    title: 'Inbox',
    component: InboxPageComponent,
  },
  {
    path: 'profile',
    title: 'Profile',
    component: ProfilePageComponent,
  },
];
