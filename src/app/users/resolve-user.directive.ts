import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ReplaySubject, Subscription, distinct, startWith } from 'rxjs';
import { UserService } from './user.service';
import { User } from './domain/user';

@Directive({
  selector: '[appResolveUser],[appResolveUserOf]',
})
export class ResolveUserDirective implements OnInit, OnDestroy {
  subscription?: Subscription;

  private _rendered$ = new ReplaySubject(1);
  get rendered$() {
    return this._rendered$.pipe(startWith(false), distinct());
  }

  @Input() set appResolveUser(param: number | number[]) {
    this.subscription?.unsubscribe();
    this.viewContainerRef.clear();
    this._rendered$.next(false);
    if (typeof param === 'number') {
      this.subscription = this.userService.getUser(param).subscribe((user) => {
        this._rendered$.next(true);
        this.viewContainerRef.createEmbeddedView(this.templateRef, {
          $implicit: user,
        });
      });
    } else if (param) {
      this.subscription = new Subscription();
      param.forEach((userId, index) => {
        const sub = this.userService.getUser(userId).subscribe((user) => {
          this._rendered$.next(true);
          this.viewContainerRef.createEmbeddedView(
            this.templateRef,
            {
              $implicit: user,
            },
            { index }
          );
        });
        this.subscription?.add(sub);
      });
    }
  }

  constructor(
    private readonly userService: UserService,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  // provides type context to html code using this directive
  static ngTemplateContextGuard(
    directive: ResolveUserDirective,
    typeContext: unknown
  ): typeContext is { $implicit: User } {
    return true;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
