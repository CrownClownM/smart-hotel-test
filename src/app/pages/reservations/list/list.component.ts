import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertModule, DropdownModule, TableModule } from 'logical-growth-components';
import { TableActionComponent } from '@components/shared/table-action/table-action.component';
import { ReservationsService } from '@API/reservations/reservations.service';
import { TitleComponent } from "@components/shared/title/title.component";
import { LoaderComponent } from "@components/shared/loader/loader.component";

@Component({
  selector: 'app-list',
  imports: [TableModule, DropdownModule, TableActionComponent, TitleComponent, LoaderComponent, AlertModule],
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

  ngOnInit(): void {
    this.loading.set(true);
    this.reservationsService.getCollection().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (error: any) => {
        this.loading.set(false);
      }
    });
  }

}
