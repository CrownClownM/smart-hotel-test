export const $ = (
  selector: string,
  scope: HTMLElement | Document = document
) => scope.querySelector(selector)

export const $$ = (
  selector: string,
  scope: HTMLElement | Document = document
) => {
  return scope.querySelectorAll(selector)
}
