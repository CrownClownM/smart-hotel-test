import { Component, Input } from '@angular/core';

@Component({
  selector: 'paragraph',
  standalone: true,
  imports: [],
  templateUrl: './paragraph.component.html'
})
export class ParagraphComponent {
  
  @Input() className = '';

}
