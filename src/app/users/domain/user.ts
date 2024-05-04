import { SrpgEvent } from 'src/app/events/domain/event';
import { NotificationSettings } from './user-settings';

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
  aboutMe?: string;
  notificationSettings: NotificationSettings;
  friendIds: number[];
  inbox: SrpgNotification[];
  eventDrafts: Partial<SrpgEvent>[];
}

export interface SrpgNotification {
  id: number;
  message: string;
  routerLink: any[];
}
