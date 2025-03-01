import { formatDate } from "date-fns"

export const APP_FORM_ERRORS = () => {
  return {
    required: 'Este campo es requerido',
    maxlength: (value: {
      requiredLength: number,
      actualLength: number
    }) => {
      const { requiredLength, actualLength } = value
      return `Longitud máxima permitida ${requiredLength}, longitud actual ${actualLength}`
    },
    email: 'No cumple con el formato de correo requerido',
    minlength: (value: {
      requiredLength: number,
      actualLength: number
    }) => {
      const { requiredLength, actualLength } = value
      return `Longitud mínima permitida ${requiredLength}, longitud actual ${actualLength}`;
    },
    max: (value: {
      max: number,
      actual: number
    }) => {
      const { max, actual } = value;
      return `El valor máximo permitido es ${max}, Valor actual ${actual}`;
    },
    min: (value: {
      min: number,
      actual: number
    }) => {
      const { actual, min } = value;
      return `El valor mínimo permitido es ${min}, valor actual ${actual}`
    },
    minDate: (value: { min: string, selected: string }) => {
      const { min, selected } = value
      return `La fecha seleccionada ${formatDate(selected, 'dd/MM/yyyy')} es menor a la fecha mínima permitida ${formatDate(min, 'dd/MM/yyyy')}`
    },
    maxDate: (value: { max: string, selected: string }) => {
      const { max, selected } = value
      return `La fecha seleccionada ${formatDate(selected, 'dd/MM/yyyy')} es mayor a la fecha maxima permitida ${formatDate(max, 'dd/MM/yyyy')}`
    },
    invalidRange: 'La fecha inicial debe ser menor que la fecha final.',
    invalidDate: 'Las fechas no pueden ser el mismo día.',
    pattern: 'No cumple con el formato requerido',
    passwordNotMatch: 'Las contraseñas no son iguales',
    invalidPasswordFormat: 'No cumple con el formato requerido: al menos una letra mayúscula, al menos una letra minúscula, al menos un dígito, sin espacios en blanco y mínimo 7 caracteres.',
    invalidFloat: (value: { value: number | string }) => {
      return `El valor ${value.value} no es un número válido`
    }
  }
}
