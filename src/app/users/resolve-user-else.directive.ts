import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ResolveUserDirective } from './resolve-user.directive';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appResolveUserElse]'
})
export class ResolveUserElseDirective implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(
    private readonly resolveUserDirective: ResolveUserDirective,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.resolveUserDirective.rendered$.subscribe(rendered => {
      this.viewContainerRef.clear();
      if (!rendered) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
