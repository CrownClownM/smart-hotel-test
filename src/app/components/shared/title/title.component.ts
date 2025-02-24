import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
})
export class TitleComponent {
  @Input({ required: true }) tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
  @Input() weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'normal';
  @Input() className = '';
  public standardClass = 'transition-all text-font-color dark:text-white';

  get titleClass(): string {
    const textSizes = {
      h1: 'text-2xl md:text-[1.8rem] lg:text-[2.125rem]',
      h2: 'text-lg md:text-2xl lg:text-3xl',
      h3: 'text-lg md:text-text-xl lg:text-2xl',
      h4: 'md:text-lg lg:text-2xl',
      h5: 'md:text-base lg:text-lg',
      h6: 'lg:text-base',
    };
    return textSizes[this.tag];
  }

  get fontWeight(): string {
    return `font-${this.weight}`;
  }


}
