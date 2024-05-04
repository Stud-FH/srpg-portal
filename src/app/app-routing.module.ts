import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventRoutes as EventRoutes } from './events/event-routes';
import { authGuard } from './users/auth.service';
import { LoginComponent } from './users/pages/login/login.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { UserRoutes } from './users/user-routes';
import { CommunityRoutes } from './community/community-routes';
import { MerchRoutes } from './merch/merch-routes';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardComponent,
      },
      ...EventRoutes,
      ...UserRoutes,
      ...CommunityRoutes,
      ...MerchRoutes,
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
