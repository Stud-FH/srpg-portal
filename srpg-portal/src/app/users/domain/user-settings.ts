import { Regions, SrpgEvent, SrpgEventType } from 'src/app/events/domain/event';
import { User } from './user';

export const Weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type Weekday = (typeof Weekdays)[number];

export type CalendarFilterMode = 'Weekday' | 'Synchronized';

export class NotificationSettings {
  regionWhitelist = [...Regions];
  calendarFilterMode: CalendarFilterMode | null = null;
  weekdayWhitelist: Weekday[] = [...Weekdays];
  calendarSyncConfigured = false;
  enableFriendBasedNotifications = false;
  interests: SrpgEventInterest[] = [new SrpgEventInterest()];
}

export class SrpgEventInterest {
  id: number = Math.random(); // TODO: replace with UUID from server
  enabled = true;
  type: SrpgEventType | null = null;
  activityOrGameSystem: string | null = null;
}

export function doNotificationSettingsApply(
  user: User,
  event: SrpgEvent
): boolean {
  if (!user.notificationSettings.regionWhitelist.includes(event.region)) {
    return false;
  }

  if (user.notificationSettings.calendarFilterMode === 'Weekday') {
    const weekday = event.date.format('dddd') as any;
    if (!user.notificationSettings.weekdayWhitelist.includes(weekday)) {
      return false;
    }
  }

  if (
    user.notificationSettings.interests
      .filter((i) => i.enabled)
      .some((interest) => {
        switch (interest.type) {
          case null:
            return true;
          case 'Social':
            return (
              event.type === 'Social' &&
              (interest.activityOrGameSystem == null ||
                interest.activityOrGameSystem === event.activity)
            );
          default:
            return (
              event.type === interest.type &&
              (interest.activityOrGameSystem == null ||
                interest.activityOrGameSystem === event.gameSystem)
            );
        }
      })
  ) {
    return true;
  }

  if (user.notificationSettings.enableFriendBasedNotifications) {
    if (user.friendIds.some((id) => event.participantIds.includes(id))) {
      return true;
    }
  }

  return false;
}
