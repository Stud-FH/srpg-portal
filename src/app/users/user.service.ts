import { Injectable } from '@angular/core';
import { User } from './domain/user';
import { Observable, of, switchMap, timer } from 'rxjs';
import { SrpgEventInterest } from './domain/user-settings';
import { MockUsers } from './mock-users';

export interface UserQuery {
  nameFilter?: string;
  excludeId?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = [...MockUsers];

  constructor() {}

  findUsers(filter: (u: User) => boolean) {
    return this.users.filter(filter);
  }

  getUsers(query?: UserQuery): Observable<User[]> {
    return timer(300).pipe(switchMap(() => of(this.getFiltered(query))));
  }

  private getFiltered(query?: UserQuery) {
    const filter = {
      name: query?.nameFilter?.toLowerCase() ?? '',
      excludeId: query?.excludeId ?? [],
    };
    return this.users
      .filter((user) => user.name.toLowerCase().includes(filter.name))
      .filter((user) => !filter.excludeId.includes(user.id))
      .map((user) => ({ ...user }));
  }

  getUser(userId: number): Observable<User> {
    return this.updateUser(userId);
  }

  updateUser(userId: number, update?: (u: User) => void): Observable<User> {
    return timer(300).pipe(
      switchMap(() => {
        const user = this.users.find((u) => u.id == userId);
        if (!user) {
          throw new Error('User not found');
        }
        if (update) {
          update(user);
        }
        return of({ ...user });
      })
    );
  }

  notifyUser(
    userId: number,
    message: string,
    routerLink: any[]
  ): Observable<User> {
    return this.updateUser(userId, (user) => {
      user.inbox.push({
        id: Math.floor(Math.random() * 0x7fffffff),
        message,
        routerLink,
      });
    });
  }
}
