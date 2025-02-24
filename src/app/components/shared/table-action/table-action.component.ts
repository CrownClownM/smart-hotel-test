import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'table-action',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table-action.component.html'
})
export class TableActionComponent {
  @Input() url: string | null = null
  @Input() className = ''
}
