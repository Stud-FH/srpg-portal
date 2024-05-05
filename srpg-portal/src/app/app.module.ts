import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigDialogComponent } from './config/config-dialog/config-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventListComponent } from './events/pages/event-list/event-list.component';
import { EventDetailsComponent } from './events/pages/event-details/event-details.component';
import { UserAvatarComponent } from './users/shared/user-avatar/user-avatar.component';
import { UserAvatarPlaceholderComponent } from './users/shared/user-avatar-placeholder/user-avatar-placeholder.component';
import { UserProfileComponent } from './users/pages/user-profile/user-profile.component';
import { CreateEventComponent } from './events/pages/create-event/create-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResolveUserDirective } from './users/resolve-user.directive';
import { LoginComponent } from './users/pages/login/login.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ImageSelectionDialogComponent } from './events/dialogs/image-selection-dialog/image-selection-dialog.component';
import { PageComponent } from './main/page/page.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { ImageComponent } from './shared/image/image.component';
import { ResolveUserElseDirective } from './users/resolve-user-else.directive';
import { NotificationsComponent } from './users/pages/notifications/notifications.component';
import { InterestDialogComponent } from './users/dialogs/interest-dialog/interest-dialog.component';
import { ConfigureCalendarSyncDialogComponent } from './users/dialogs/configure-calendar-sync-dialog/configure-calendar-sync-dialog.component';
import { ShopPageComponent } from './merch/pages/shop-page/shop-page.component';
import { SupportUsPageComponent } from './community/pages/support-us-page/support-us-page.component';
import { InboxPageComponent } from './users/pages/inbox-page/inbox-page.component';
import { ProfilePageComponent } from './users/pages/profile-page/profile-page.component';
import { AboutMeDialogComponent } from './users/dialogs/about-me-dialog/about-me-dialog.component';
import { StartConversationDialogComponent } from './users/dialogs/start-conversation-dialog/start-conversation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigDialogComponent,
    EventListComponent,
    EventDetailsComponent,
    UserAvatarComponent,
    UserAvatarPlaceholderComponent,
    UserProfileComponent,
    CreateEventComponent,
    ResolveUserDirective,
    LoginComponent,
    ImageSelectionDialogComponent,
    PageComponent,
    DashboardComponent,
    ImageComponent,
    ResolveUserElseDirective,
    NotificationsComponent,
    InterestDialogComponent,
    ConfigureCalendarSyncDialogComponent,
    ShopPageComponent,
    SupportUsPageComponent,
    InboxPageComponent,
    ProfilePageComponent,
    AboutMeDialogComponent,
    StartConversationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTreeModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
