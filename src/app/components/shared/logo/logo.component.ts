import { Component, Input } from '@angular/core';

@Component({
  selector: 'hotel-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styles: [],
})
export class LogoComponent {
  @Input() size = 16;
  @Input() title = true;

  get logoSizeClass(): string {
    return `size-${this.size}`;
  }
}
