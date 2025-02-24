import { Injectable, signal } from '@angular/core';
import { SidebarObject } from './sidebar.interface';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  public _isOpen: boolean;
  public _toggleAside$ = signal<boolean>(false);
  public readonly toggleAside$ = this._toggleAside$.asReadonly();

  public sidebarOptions: SidebarObject;

  constructor() {
    this._isOpen = false;
    this._toggleAside$.set(this._isOpen);
    this.sidebarOptions = this.setSidebarOptions()
  }

  setOpen() {
    this._isOpen = true;
    this._toggleAside$.set(this._isOpen);
  }

  setClosed() {
    this._isOpen = false;
    this._toggleAside$.set(this._isOpen);
  }

  toggle() {
    this._isOpen = !this._isOpen;
    this._toggleAside$.set(this._isOpen);
  }

  setSidebarOptions(): SidebarObject {
    return {
      admin: [
        {
          label: 'Inicio',
          icon: 'fa-solid fa-house',
          linkTo: '/app/inicio',
        },
        {
          label: 'Hoteles',
          icon: 'fa-solid fa-building-user',
          linkTo: '/app/hoteles/lista'
        },
        {
          label: 'Reservaciones',
          icon: 'fa-solid fa-building-circle-check',
          linkTo: '/app/reservaciones/lista'
        },
      ],
      traveler: [
        {
          label: 'Inicio',
          icon: 'fa-solid fa-house',
          linkTo: '/app/inicio',
        },
        {
          label: 'Hoteles',
          icon: 'fa-solid fa-building-user',
          linkTo: '/app/hoteles/lista'
        },
        {
          label: 'Reservaciones',
          icon: 'fa-solid fa-building-circle-check',
          linkTo: '/app/reservaciones/lista'
        },
      ]
    };
  }
}
