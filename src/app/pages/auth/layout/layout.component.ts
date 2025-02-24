
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemePickerComponent } from "@components/shared/theme-picker/theme-picker.component";
import { LogoComponent } from "@components/shared/logo/logo.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ThemePickerComponent, LogoComponent],
  templateUrl: './layout.component.html',
  styles: []
})
export class LayoutComponent {

}
