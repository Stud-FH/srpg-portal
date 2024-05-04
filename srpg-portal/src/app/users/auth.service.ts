import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { User } from './domain/user';
import { Observable, ReplaySubject } from 'rxjs';

export const authGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  return (
    authService.isAuthenticated ||
    (await authService.redirectToLogin(route.url[0].toString()))
  );
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly key = 'authenticated_user_id';
  private _redirectUrl = '/upcoming';
  private _authenticatedUserId: number | null =
    AuthService.loadFrom(sessionStorage);
  private _authenticatedUserId$ = new ReplaySubject<number | null>(1);

  get authenticatedUserId$(): Observable<number | null> {
    return this._authenticatedUserId$;
  }

  get authenticatedUserId() {
    return this._authenticatedUserId;
  }

  get isAuthenticated() {
    return this._authenticatedUserId != null;
  }

  constructor(private readonly router: Router) {
    this.init();
  }

  private init(): void {
    this._authenticatedUserId$.next(this._authenticatedUserId);
    this._authenticatedUserId$.subscribe((value) => {
      this._authenticatedUserId = value;
      if (value == null) {
        AuthService.clear(sessionStorage);
      } else {
        AuthService.update(sessionStorage, value);
      }
    });
  }

  private static loadFrom(storage: Storage): number | null {
    const entry = storage.getItem(AuthService.key);
    return entry == null ? null : +entry;
  }

  private static update(storage: Storage, value: number) {
    storage.setItem(AuthService.key, value.toString());
  }

  private static clear(storage: Storage) {
    storage.removeItem(AuthService.key);
  }

  async redirectToLogin(redirectUrl?: string) {
    if (redirectUrl != null) {
      this._redirectUrl = redirectUrl;
    }
    return await this.router.navigate(['/login']);
  }

  async logout(redirectUrl?: string) {
    this._authenticatedUserId$.next(null);
    return await this.redirectToLogin(redirectUrl);
  }

  async login(user: User) {
    this._authenticatedUserId$.next(user.id);
    return await this.leaveLoginPage();
  }

  async leaveLoginPage() {
    return await this.router.navigate([this._redirectUrl]);
  }
}
