import { Component, Input } from '@angular/core';

@Component({
  selector: 'content-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './content-wrapper.component.html'
})
export class ContentWrapperComponent {
  @Input() className = '';
}
