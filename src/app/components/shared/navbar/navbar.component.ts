import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'logical-growth-components';
import { LogoComponent } from "../logo/logo.component";
import { SideBarService } from '../sidebar/sidebar.service';
import { ThemePickerComponent } from "../theme-picker/theme-picker.component";
import { storage } from '@utils/storage-handlers';

@Component({
  selector: 'Navbar',
  standalone: true,
  imports: [LogoComponent, CommonModule, ThemePickerComponent, ButtonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  public controller = inject(SideBarService);
  public user = storage.GET({ key: 'userData' });

  public toggleNav(): void {
    this.controller.toggle();
  }

}
