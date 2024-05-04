import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user.service';
import { Subscription } from 'rxjs';
import { User } from '../../domain/user';

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
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.userService
      .getUsers()
      .subscribe((users) => (this.users = users));
    this.subscription.add(
      this.authService.authenticatedUserId$.subscribe((userId) => {
        if (userId != null) {
          this.authService.leaveLoginPage();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async login(user: User) {
    this.loginInProcess = user.name;
    await this.authService.login(user);
  }
}
