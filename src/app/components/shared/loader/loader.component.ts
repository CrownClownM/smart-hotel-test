import { Component, input } from '@angular/core';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html'
})
export class LoaderComponent {
  public SIZES = {
    small: {
      outer: 'size-16',
      inner: 'size-12'
    },
    medium: {
      outer: 'size-20',
      inner: 'size-16'
    },
    large: {
      outer: 'size-24',
      inner: 'size-20'

    }
  }
  className = input<string>('')
  size = input<'small' | 'medium' | 'large'>('medium')
}
