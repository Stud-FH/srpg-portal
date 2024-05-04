import { Component } from '@angular/core';
import { CurrentUserService } from '../../current-user.service';
import { SrpgNotification, User } from '../../domain/user';
import { UserService } from '../../user.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss'],
})
export class InboxPageComponent {
  user: User | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly currentUserService: CurrentUserService,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.user = await firstValueFrom(this.currentUserService.currentUser$);
    if (this.user == null) {
      this.authService.redirectToLogin('/inbox');
    }
  }

  async remove(notification: SrpgNotification) {
    this.user = await lastValueFrom(
      this.userService.updateUser(this.user!.id, (user) => {
        user.inbox = user.inbox.filter((n) => n.id !== notification.id);
      })
    );
  }
}
