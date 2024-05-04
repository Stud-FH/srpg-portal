import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/users/auth.service';
import { CurrentUserService } from 'src/app/users/current-user.service';

type Page = {
  url: string;
  label: string;
  hidden: boolean;
};

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  @Input() header = 'SwissRPG Portal';

  @Input() url?: string;

  @Input() navIcon = 'arrow_back';

  @Input() navRouterLink: any[] = ['/upcoming'];

  @Input() disableNav = false;

  @Input() disableDrawer = false;

  readonly currentUser$ = this.currentUserService.currentUser$;

  readonly pages: Page[] = [
    { url: '/upcoming', label: 'Upcoming', hidden: false },
    { url: '/profile', label: 'Profile', hidden: true },
    { url: '/notifications', label: 'Notifications', hidden: true },
    { url: '/shop', label: 'Merch Shop', hidden: false },
    { url: '/support', label: 'Support Us', hidden: false },
  ];

  get pageList() {
    return this.pages.filter((p) => this.isOpen(p) || !p.hidden);
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly authService: AuthService
  ) {}

  isOpen(page: Page) {
    return this.url && page.url === this.url;
  }

  async logout() {
    return await this.authService.logout(this.url);
  }
}
