import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './link.component.html'
})
export class LinkComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() link: string | null = null;
  @Input() isHref = false;
  @Input() target = '_blank';


  get fontSizeClass(): string {
    return `text-${this.size}`;
  }

  public handleClick(event: Event) {
    event.preventDefault();
  }
}
