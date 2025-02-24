import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContentWrapperComponent } from "@components/shared/content-wrapper/content-wrapper.component";
import { NavbarComponent } from "@components/shared/navbar/navbar.component";
import { SidebarComponent } from "@components/shared/sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ContentWrapperComponent, NavbarComponent, SidebarComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {

}
