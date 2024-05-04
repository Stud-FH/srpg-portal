import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './domain/user';
import { UserService } from './user.service';
import { of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService implements OnInit {
  private _currentUser: User | null = null;

  readonly currentUser$ = this.authService.authenticatedUserId$.pipe(
    switchMap(id => id == null? of(null) : this.userService.getUser(id))
  );

  get currentUser() {
    return this._currentUser;
  }

  get currentUserId(): number {
    const id = this.authService.authenticatedUserId;
    if (id == null) {
      throw new Error('not authenticated');
    }
    return id;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => this._currentUser = user);
  }
}
