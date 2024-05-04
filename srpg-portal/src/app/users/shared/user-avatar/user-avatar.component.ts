import { Component, Input } from '@angular/core';
import { User } from '../../domain/user';
import { CurrentUserService } from '../../current-user.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent {

  @Input() user!: User;

  @Input() role?: 'organizer';

  get imageStyle() {
    return {
      'background-image': `url(${this.user.avatarUrl})`,
    };
  }

  get isCurrentUser() {
    return this.user.id === this.currentUserService.currentUserId;
  }

  constructor(
    private readonly currentUserService: CurrentUserService
  ) {}
}
