import { Routes } from '@angular/router';
import { SupportUsPageComponent } from './pages/support-us-page/support-us-page.component';

export const CommunityRoutes: Routes = [
  {
    path: 'support',
    title: 'Support Us',
    component: SupportUsPageComponent,
  },
];
