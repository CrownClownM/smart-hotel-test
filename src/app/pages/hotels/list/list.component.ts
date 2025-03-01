import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HotelsService } from '@API/hotels/hotels.service';
import { CardComponent } from '@components/shared/card/card.component';
import { LoaderComponent } from "@components/shared/loader/loader.component";
import { ParagraphComponent } from "@components/shared/paragraph/paragraph.component";
import { TagComponent } from "@components/shared/tag/tag.component";
import { TitleComponent } from "@components/shared/title/title.component";
import { notification } from '@utils/notifications';
import { Permissions } from '@utils/permissions';
import { AlertModule, ButtonModule, IconButtonModule, TooltipDirective } from 'logical-growth-components';

@Component({
  selector: 'app-list',
  imports: [TitleComponent, ButtonModule, ParagraphComponent, TagComponent, IconButtonModule, TooltipDirective, LoaderComponent, CardComponent, TitleCasePipe, AlertModule],
  templateUrl: './list.component.html',
})
export class ListComponent extends Permissions implements OnInit {


  private _router = inject(Router);
  public loading = signal<boolean>(false);

  constructor(
    public hotelService: HotelsService
  ) {
    super();
  }

  ngOnInit(): void {
    this._fetchData();
  }

  private _fetchData(): void {
    this.loading.set(true);
    if(this.isAdmin){
      this._obtainAdminHotels();
    } else {
      this._obtainUserHotels();
    }
  }

  private _obtainAdminHotels(): void {
    this.hotelService.getCollection().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private _obtainUserHotels(): void {
    this.hotelService.getHotelsUser().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  public colorTag(value: boolean): string {
    return value ? 'green' : 'red';
  }

  public contentTag(value: boolean): string {
    return value ? 'Activo' : 'Inactivo';
  }

  public changeStatus(id: string, status: boolean): void {
    this.hotelService.updateHotel(id, { enabled: status }).subscribe({
      next: () => {
        notification.fire({
          title: 'Hotel',
          text: 'Se ha cambiardo el estado correctamente',
          type: 'success',
        });
        this._fetchData();
      },
    });
  }

  public goCreate(): void {
    this._router.navigate(['/app/hoteles/crear']);
  }

  public goEdit(id: string): void {
    this._router.navigate([`/app/hoteles/editar/${id}`]);
  }

  public goRooms(id: string): void {
    this._router.navigate([`/app/habitaciones/lista/${id}`]);
  }
}
