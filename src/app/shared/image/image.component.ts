import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input() url!: string;

  @Input() height = 200;

  @HostBinding('style') get style() {
    return {
      'display': 'block',
      'background-size': 'cover',
      'background-position': 'center',
      'background': `url(${this.url})`,
      'width': '100%',
      'height': `${this.height}px`,
    };
  }
}
