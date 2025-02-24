import { $ } from "./js-selector";
import { storage } from "./storage-handlers";

const STORAGE_THEME_NAME = 'theme'

export function setTheme(theme: string) {
  const html = $('html') as HTMLElement;
  html?.setAttribute('class', theme);
  storage.SET({
    key: STORAGE_THEME_NAME,
    value: theme
  });
}

export function initTheme() {
  const theme = storage.GET({
    key: STORAGE_THEME_NAME,
    defaultValue: 'light'
  }) as string;

  setTheme(theme)
}
