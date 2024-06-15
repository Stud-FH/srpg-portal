import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { Subscription } from 'rxjs';
import { User } from '../../domain/user';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from 'src/app/auth/auth-config';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  users?: User[];

  loginInProcess?: string;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private oauthService: OAuthService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async discordLogin() {
    await this.authService.pkce();
  }

  async login(user: User) {
    this.loginInProcess = user.name;
    // await this.authService.login(user);
  }
}
