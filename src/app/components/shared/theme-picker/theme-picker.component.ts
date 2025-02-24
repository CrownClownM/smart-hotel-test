import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { storage } from '@utils/storage-handlers';
import { setTheme } from '@utils/theme';

@Component({
  selector: 'theme-picker',
  standalone: true,
  imports: [NgClass],
  templateUrl: './theme-picker.component.html'
})
export class ThemePickerComponent {
  public activeTheme = storage.GET({ key: 'theme', defaultValue: 'light' })

  public themes = ['light', 'dark']

  public changeTheme(theme: string) {
    this.activeTheme = theme
    setTheme(theme);
  }

  public getThemeIcon(theme: string) {
    return theme === 'dark' ? 'moon' : 'sun'
  }
}
