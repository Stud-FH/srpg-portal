import { generateDraft } from '../events/mock-events';
import { User } from './domain/user';
import { NotificationSettings } from './domain/user-settings';

let nextId = 1;

function createUser(name: string, gender: 'm' | 'f', aboutMe?: string): User {
  const id = nextId++;
  const user: User = {
    id,
    name,
    aboutMe,
    avatarUrl: avatarUrl(id, gender),
    notificationSettings: new NotificationSettings(),
    friendIds: [],
    inbox: [
      {
        id: Math.floor(Math.random() * 0x7fffffff),
        message: 'Welcome to SwissRPG!',
        routerLink: ['/upcoming'],
      },
    ],
    eventDrafts: [],
  };
  user.eventDrafts.push(generateDraft(user));
  return user;
}

function avatarUrl(id: number, gender: 'm' | 'f') {
  switch (gender) {
    case 'm':
      return `https://randomuser.me/api/portraits/men/${id}.jpg`;
    case 'f':
      return `https://randomuser.me/api/portraits/women/${id}.jpg`;
  }
}

export const MockUsers: User[] = [
  createUser('Tim Hoover', 'm', 'I am a friendly person.'),
  createUser('Jane Doe', 'f', 'I am a mysterious person.'),
  createUser('Alice Smith', 'f', 'I am a happy person.'),
  createUser('Charlie Brown', 'm'),
  createUser('George Ruby', 'm'),
  createUser('Diane Evans', 'f'),
  createUser('Bob Johnson', 'm'),
  createUser('Frank White', 'm'),
  createUser('Eve Adams', 'f'),
];
