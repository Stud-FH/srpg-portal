import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

export interface NavItem {
  icon: string;
  routerLink: any[];
}

export interface PageContext {
  pageHeader?: string;
  navEscape?: NavItem;
  navConfigure?: NavItem;
}

@Injectable({
  providedIn: 'root',
})
export class AppContextService {

  private _pageContext$ = new Subject<PageContext>();
  pageContext$: Observable<PageContext> = this._pageContext$;

  constructor(
    private readonly router: Router
  ) {}

  registerPageContext(pageContext: PageContext) {
    this._pageContext$.next(pageContext);
  }

  showUpcomingEvents() {
    this.router.navigate(['upcoming']);
  }

}
