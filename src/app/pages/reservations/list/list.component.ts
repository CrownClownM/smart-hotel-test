import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertModule, DropdownModule, TableModule } from 'logical-growth-components';
import { TableActionComponent } from '@components/shared/table-action/table-action.component';
import { ReservationsService } from '@API/reservations/reservations.service';
import { TitleComponent } from "@components/shared/title/title.component";
import { LoaderComponent } from "@components/shared/loader/loader.component";
import { Dialog } from '@angular/cdk/dialog';
import { DetailsModalComponent } from '@components/reservations/details-modal/details-modal.component';
import { reservationsData } from '@interfaces/reservations/reservations.interface';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [TableModule, DropdownModule, TableActionComponent, TitleComponent, LoaderComponent, AlertModule, TitleCasePipe, CurrencyPipe],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  public loading = signal<boolean>(false);
  public headings: string[] = [
    'Nombre del hotel',
    'Ubicación',
    'Habitación',
    'Acciones',
  ];
  public reservationsService = inject(ReservationsService);
  private _dialog = inject(Dialog)

  ngOnInit(): void {
    this.loading.set(true);
    this.reservationsService.getCollection().subscribe({
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

}
