import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertModule, DropdownModule, TableModule } from 'logical-growth-components';
import { TableActionComponent } from '@components/shared/table-action/table-action.component';
import { ReservationsService } from '@API/reservations/reservations.service';
import { TitleComponent } from "@components/shared/title/title.component";
import { LoaderComponent } from "@components/shared/loader/loader.component";
import { Dialog } from '@angular/cdk/dialog';
import { DetailsModalComponent } from '@components/reservations/details-modal/details-modal.component';
import { reservationsData } from '@interfaces/reservations/reservations.interface';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Permissions } from '@utils/permissions';

@Component({
  selector: 'app-list',
  imports: [TableModule, DropdownModule, TableActionComponent, TitleComponent, LoaderComponent, AlertModule, TitleCasePipe, CurrencyPipe, DatePipe],
  templateUrl: './list.component.html',
})
export class ListComponent extends Permissions implements OnInit {
  public loading = signal<boolean>(false);
  public headings: string[] = [
    'Nombre del hotel',
    'Habitación',
    'Fecha de entrada',
    'Fecha de salida',
    'Valor total',
    'Acciones',
  ];
  public reservationsService = inject(ReservationsService);
  private _dialog = inject(Dialog);

  constructor(){
    super();
  }

  ngOnInit(): void {
    this.loading.set(true);
    if(this.isAdmin){
      this._adminReservations();
    } else {
      this._userReservations();
    }

  }

  private _adminReservations(): void {
    this.reservationsService.getCollection().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private _userReservations(): void {
    this.reservationsService.getReservationsByUser(this.user.user.uid).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  public openModalDetails(item: reservationsData): void {
    this._dialog.open(DetailsModalComponent, {
      data: {
        item: item
      },
      width: '600px'
    });
  }

  public calculateDays(start: string, end: string): number {
    const checkin = new Date(start);
    const checkout = new Date(end);
    const diff = checkout.getTime() - checkin.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

}
