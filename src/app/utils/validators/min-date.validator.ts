import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { parseISO } from "date-fns";

export function minDate(date: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !date) {
      return null;
    }

    const selectedDate = parseISO(control.value);
    const minDateValue = parseISO(date)

    if (selectedDate.getTime() < minDateValue.getTime()) {
      return {
        minDate: {
          min: minDateValue,
          selected: selectedDate
        }
      };
    }

    return null;
  };
}
