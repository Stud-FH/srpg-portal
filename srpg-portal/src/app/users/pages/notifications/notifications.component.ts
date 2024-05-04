import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { CurrentUserService } from '../../current-user.service';
import { User } from '../../domain/user';
import { Subscription, filter, lastValueFrom, map } from 'rxjs';
import { UserService } from '../../user.service';
import {
  CalendarFilterMode,
  NotificationSettings,
  SrpgEventInterest,
  Weekdays,
} from '../../domain/user-settings';
import { MatDialog } from '@angular/material/dialog';
import { InterestDialogComponent } from '../../dialogs/interest-dialog/interest-dialog.component';
import { ConfigureCalendarSyncDialogComponent } from '../../dialogs/configure-calendar-sync-dialog/configure-calendar-sync-dialog.component';
import { Region, Regions } from 'src/app/events/domain/event';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  private subscription!: Subscription;

  readonly regionWhitelist = new FormControl<Region[]>([]);
  readonly calendarFilterMode = new FormControl<CalendarFilterMode | null>(
    null
  );
  readonly weekdayWhitelist = new FormControl<string[]>([]);
  readonly calendarSyncConfigured = new FormControl<boolean>(false);
  readonly enableFriendBasedNotifications = new FormControl<boolean>(false);

  readonly addFriend = new FormControl<User | string | null>(null);

  currentUser?: User;
  friendIds: number[] = [];
  interests: SrpgEventInterest[] = [];
  addFriendOptions: User[] = [];
  addingFriend = false;
  addingInterest = false;

  readonly notificationSettings = this.formBuilder.group({
    regionWhitelist: this.regionWhitelist,
    calendarFilterMode: this.calendarFilterMode,
    weekdayWhitelist: this.weekdayWhitelist,
    calendarSyncConfigured: this.calendarSyncConfigured,
    enableFriendBasedNotifications: this.enableFriendBasedNotifications,
  });

  Regions = Regions;
  Weekdays = Weekdays;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly currentUserService: CurrentUserService,
    private readonly userService: UserService,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscription = this.currentUserService.currentUser$
      .pipe(
        filter((user) => user != null),
        map((user) => user as User)
      )
      .subscribe((user) => this.patch(user));

    this.notificationSettings.valueChanges
      .pipe(
        filter(() => this.currentUser != null),
        filter(() => this.notificationSettings.valid),
        filter((value) => value != null),
        map((value) => value as NotificationSettings)
      )
      .subscribe(async (input) => {
        await this.update((u) => {
          Object.assign(u.notificationSettings, input);
        });
      });

    this.addFriend.valueChanges.subscribe(async (input) => {
      if (typeof input === 'string') {
        const options = await lastValueFrom(
          this.userService.getUsers({
            nameFilter: input,
            excludeId: [this.currentUser!.id, ...this.currentUser!.friendIds],
          })
        );
        this.addFriendOptions = options;
      } else if (input != null) {
        this.addingFriend = true;
        this.addFriend.setValue(null);
        await this.update((u) => u.friendIds.push(input.id));
        this.addingFriend = false;
        this.addFriendOptions = [];
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  interestIcon(interest: SrpgEventInterest) {
    if (!interest.enabled) {
      return 'do_not_disturb_on';
    }
    switch (interest.type) {
      case null:
        return 'crop_free';
      case 'Campaign':
        return 'history_edu';
      case 'One-Shot':
        return 'bolt';
      case 'Social':
        return 'group';
      default:
        throw new Error(`Unhandled case: ${interest.type}`);
    }
  }

  interestName(interest: SrpgEventInterest) {
    const suffix = interest.enabled ? '' : ' (off)';
    switch (interest.type) {
      case null:
        return `Anything${suffix}`;
      case 'Campaign':
        return `${
          interest.activityOrGameSystem ?? ''
        } Campaign${suffix}`.trim();
      case 'One-Shot':
        return `${
          interest.activityOrGameSystem ?? ''
        } One-Shot${suffix}`.trim();
      case 'Social':
        return `${interest.activityOrGameSystem ?? 'Social Events'}${suffix}`;
      default:
        throw new Error(`Unhandled case: ${interest.type}`);
    }
  }

  patch(user: User) {
    this.currentUser = user;
    this.friendIds = [...user.friendIds];
    this.interests = [...user.notificationSettings.interests];
    this.notificationSettings.patchValue(user.notificationSettings, {
      emitEvent: false,
    });
  }

  private async update(update: (user: User) => void) {
    const updated = await lastValueFrom(
      this.userService.updateUser(this.currentUser!.id, update)
    );
    this.patch(updated);
  }

  async configureCalendarSync() {
    const ref = this.matDialog.open(ConfigureCalendarSyncDialogComponent);
    const result = await lastValueFrom(ref.afterClosed());
    if (result === undefined) {
      return;
    }
    await this.update((u) => {
      u.notificationSettings.calendarSyncConfigured = true;
    });
  }

  async removeCalendarSync() {
    await this.update((u) => {
      u.notificationSettings.calendarSyncConfigured = false;
    });
  }

  async addInterest() {
    this.addingInterest = true;
    const ref = this.matDialog.open(InterestDialogComponent, {
      data: new SrpgEventInterest(),
    });
    const result = await lastValueFrom(ref.afterClosed());
    if (result === undefined) {
      return;
    }
    await this.update((u) => {
      u.notificationSettings.interests.push(result);
    });
    this.addingInterest = false;
  }

  async removeInterest(interest: SrpgEventInterest) {
    await this.update((u) => {
      const interests = u.notificationSettings.interests;
      u.notificationSettings.interests = interests.filter(
        (i) => i.id !== interest.id
      );
    });
  }

  async configureInterest(interest: SrpgEventInterest) {
    const ref = this.matDialog.open(InterestDialogComponent, {
      data: interest,
    });
    const result = await lastValueFrom(ref.afterClosed());
    if (result === undefined) {
      return;
    }
    await this.update((u) => {
      const i = u.notificationSettings.interests.find(
        (i) => i.id === interest.id
      );
      if (i != null) {
        Object.assign(i, result, { id: interest.id });
      }
    });
  }

  foo(event: any) {
    console.log(event);
  }
}
