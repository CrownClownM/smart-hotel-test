import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStringArr',
  standalone: true
})
export class FilterStringArrPipe implements PipeTransform {

  transform(value: string[], filterValue: string): string[] {
    return value.filter(item => item.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()))
  }

}
