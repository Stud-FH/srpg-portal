export const SrpgEventTypes = ['Social', 'Campaign', 'One-Shot'] as const;

export type SrpgEventType = (typeof SrpgEventTypes)[number];

export const Regions = [
  'Zurich',
  'Bern',
  'Basel',
  'Romandie',
  'Lucerne',
  'St. Gallen',
  'Aargau',
  'Online',
  'Lugano',
  'Chur',
] as const;

export type Region = (typeof Regions)[number];

export interface SrpgEvent {
  id: number;
  region: Region;
  type: SrpgEventType;
  activity?: string;
  gameSystem?: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];

  recurrences: SrpgEventRecurrence[];
  date: moment.Moment;
  time: string;
  duration: number;
  dateTime?: moment.Moment;
  location?: string;
  locationPrivate: boolean;
  organizerId: number;
  participantsLimit: number;
  participantIds: number[];
  waitingListIds: number[];
}

export interface SrpgEventRecurrence {
  eventId: number;
  dateTime: moment.Moment;
  location?: string;
  locationPrivate: boolean;
  organizerId: number;
  participantsLimit: number;
  participantIds: number[];
  waitingListIds: number[];
}

export function availableSlots(event: SrpgEvent): number {
  return Math.max(
    0,
    event.participantsLimit -
      event.participantIds.filter((p) => p !== event.organizerId).length
  );
}
