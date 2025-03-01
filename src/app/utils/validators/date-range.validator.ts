import { FormGroup } from "@angular/forms";

export function rangeDateValidator (group: FormGroup ) {
  const invalidRange = group.get('start_date')!.value > group.get('end_date')!.value;
  const invalidDate = group.get('start_date')!.value === group.get('end_date')!.value;
  return invalidRange ? { invalidRange: true } : invalidDate ? { invalidDate: true } : null;
}
