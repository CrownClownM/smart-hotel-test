import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { $, $$ } from '@utils/js-selector';
import { ReplaceSpacesPipe } from '@utils/pipes/replace-spaces.pipe';
import { limitTextPipe, TooltipDirective } from 'logical-growth-components';
import { SidebarOption } from './sidebar.interface';
import { SideBarService } from './sidebar.service';
import { AuthService } from '@API/auth/auth.service';
import { storage } from '@utils/storage-handlers';

@Component({
  selector: 'Sidebar',
  standalone: true,
  imports: [NgClass, limitTextPipe, TooltipDirective, ReplaceSpacesPipe],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public controller = inject(SideBarService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  public sidebarOptions: SidebarOption[] = [];
  public actualSuboption = '';

  ngOnInit(): void {
    this._defineProfileType();
  }

  public closeSesssion() {
    this.controller.setClosed();
    this._authService.logOut();
  }

  get sideBarClass(): string {
    const sideBarStyle = this.controller._toggleAside$()
      ? 'w-72'
      : 'w-20 -translate-x-full';
    return sideBarStyle;
  }

  get listItemsClass(): string {
    const sideBarStyle = this.controller._toggleAside$()
      ? 'border-2 border-gray-300 dark:border-gray-500 border-l-4 border-l-accent hover:bg-accent dark:border-l-accent hover:border-l-accent-hover dark:hover:border-l-accent-hover justify-between'
      : 'border-2 border-transparent border-l-transparent dark:border-l-transparent hover:bg-accent justify-start px-3';
    return sideBarStyle;
  }

  get listButtonsClass(): string {
    const sideBarStyle = this.controller._toggleAside$()
      ? 'justify-end'
      : 'justify-center';
    return sideBarStyle;
  }

  get listLabelClass(): string {
    const sideBarStyle = this.controller._toggleAside$()
      ? 'w-auto opacity-1 ms-3'
      : 'h-0 w-0 opacity-0';
    return sideBarStyle;
  }

  private _defineProfileType(): void {
    const user = storage.GET({ key: 'userData' });

    if (user?.role === 'admin') {
      this.sidebarOptions = this.controller.sidebarOptions.admin
    }
    if (user?.role === 'traveler') {
      this.sidebarOptions = this.controller.sidebarOptions.traveler
    }
  }

  public closeSidebar(): void {
    this.controller.setClosed();
  }

  public action(option: SidebarOption): void {
    if (option.linkTo) {
      this._router.navigate([option.linkTo], {
        queryParams: option.params
      });
      this.actualSuboption = '';
      this._sidebarStatus(option);
      this.controller.setClosed();
    } else {
      this._sidebarStatus(option);
    }
  }

  private _sidebarStatus(option: SidebarOption) {
    const options = $$('[data-options-container=true]');
    const optionsContainer = $(`#${option.label.replace(/\s+/g, '_')}_options`) as HTMLElement;

    options.forEach((option) => {
      const element = option as HTMLElement;
      element.style.height = '0px';
    })

    if (optionsContainer) {
      if (this.actualSuboption !== option.label) {
        optionsContainer.style.height = `${optionsContainer.scrollHeight}px`;
        this.actualSuboption = option.label;
      } else {
        optionsContainer.style.height = '0px';
        this.actualSuboption = '';
      }
    }

  }

  public activeSubmenu(label: string){
    return this.isActiveOption(label) ? 'rotate-180' : '';
  }

  public activeSuboptionsList(label: string){
    return this.isActiveOption(label) && !this.controller._toggleAside$() ? 'bg-gray-200 dark:bg-neutral-600 rounded' : '';
  }

  public activeSuboptions(label: string) {
    return this.isActiveOption(label) ? 'bg-accent hover:bg-accent border-l-accent-hover dark:border-l-accent-hover' : 'hover:bg-accent';
  }

  public activeButton(label: string) {
    return this.isActiveOption(label) ? '!flex flex-col gap-2' : '';
  }

  public isActiveOption(label: string) {
    return label === this.actualSuboption
  }
}
