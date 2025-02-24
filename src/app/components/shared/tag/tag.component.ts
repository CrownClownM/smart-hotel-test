import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TooltipDirective } from 'logical-growth-components';

@Component({
  selector: 'tag',
  standalone: true,
  imports: [TooltipDirective, NgStyle],
  templateUrl: './tag.component.html'
})
export class TagComponent {
  @Input() content = '';
  @Input() color = 'default';
  @Input() tooltipPosition: 'left' | 'right' | 'top' | 'bottom' = 'left'
  @Input() showTooltip = true;
  public colors: Record<string, string> = {
    default: '#546E7A',
    gray: '#999999',
    green: '#4CAF50',
    blue: '#3c78d8',
    yellow: '#F1C232',
    red: '#D32F2F',
    orange: '#fd823f',
    secondary: '#343841',
    dark_blue: '#0D47A1',
    sky_blue: '#03a9f4'
  }

  public isHexa(color: string): boolean {
    return color.startsWith('#')
  }

  public getColor(color: string): string {
    if (!color) return this.colors['default'];
    return this.isHexa(color) ? color : this.colors[color]
  }
}

