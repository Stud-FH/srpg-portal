import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar-placeholder',
  templateUrl: './user-avatar-placeholder.component.html',
  styleUrls: ['./user-avatar-placeholder.component.scss'],
})
export class UserAvatarPlaceholderComponent {
  @Input() overlayText = '';

  @Input() tooltip = '';

  @Input() href?: string;
}
