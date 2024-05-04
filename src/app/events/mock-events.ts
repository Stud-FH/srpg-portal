import * as moment from 'moment';
import {
  Region,
  SrpgEvent,
  SrpgEventType,
  SrpgEventTypes,
} from './domain/event';
import { User } from '../users/domain/user';
import { MockEventImages } from './mock-event-images';

const loremIpsum = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
let nextId = 1;

function randomType(): SrpgEventType {
  return SrpgEventTypes[Math.floor(Math.random() * SrpgEventTypes.length)];
}

function randomRegion(user: User): Region {
  const regions = user.notificationSettings.regionWhitelist;
  return regions[Math.floor(Math.random() * regions.length)];
}

function randomImageUrl(): string {
  return MockEventImages[Math.floor(Math.random() * MockEventImages.length)];
}

export function generateDraft(user: User): Partial<SrpgEvent> {
  return {
    type: randomType(),
    region: randomRegion(user),
    date: moment('2021-12-24'),
    time: '20:00',
    duration: 4,
    locationPrivate: false,
    title: 'Christmas Party',
    description: loremIpsum,
    imageUrl: randomImageUrl(),
    tags: ['Christmas', 'Party'],
    organizerId: user.id,
    participantsLimit: 10,
    participantIds: [],
  };
}

export const MockEvents: SrpgEvent[] = [
  {
    id: 1,
    title: 'The mysterious Cheese in the Dark',
    type: 'One-Shot',
    region: 'Zurich',
    location: '(private)',
    locationPrivate: true,
    date: moment('2021-01-01'),
    time: '19:00',
    duration: 4,
    description:
      'In the busy streets of Zurich, a mysterious smelly ooze is corrupting the minds of the citizens. People disappear randomly and without any trace. You have been tasked to investigate this mystery. But beware, the cheese is not the only thing that is dark. Soon you realize that something much older and sinister is at play. Will you be able to withstand the ever corrupting power of the cheese? Or will you succumb to the abyss?',
    imageUrl: MockEventImages[6],
    tags: ['DnD', 'Cheese', 'Dark', 'Mystery'],
    organizerId: 1,
    participantsLimit: 5,
    participantIds: [1, 2, 3],
    waitingListIds: [],
    recurrences: [],
  },
  {
    id: 2,
    title: 'Event 2',
    type: 'Campaign',
    region: 'Bern',
    location: 'To be specified',
    locationPrivate: false,
    date: moment('2021-02-02'),
    time: '18:00',
    duration: 4,
    description: 'Description 2',
    imageUrl: MockEventImages[4],
    organizerId: 2,
    participantsLimit: 2,
    participantIds: [2, 4, 5, 7],
    waitingListIds: [],
    recurrences: [],
  },
  {
    id: 3,
    title: 'Event 3',
    type: 'Social',
    region: 'Aargau',
    location: 'Hans im Glück',
    locationPrivate: false,
    date: moment('2021-03-03'),
    time: '17:30',
    duration: 4,
    description: 'Description 3',
    imageUrl: MockEventImages[3],
    organizerId: 7,
    participantsLimit: 40,
    participantIds: [7, 3, 6, 5],
    waitingListIds: [],
    recurrences: [],
  },
];
