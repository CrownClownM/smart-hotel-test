import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '@API/rooms/rooms.service';
import { CardComponent } from '@components/shared/card/card.component';
import { LoaderComponent } from '@components/shared/loader/loader.component';
import { ParagraphComponent } from '@components/shared/paragraph/paragraph.component';
import { TagComponent } from '@components/shared/tag/tag.component';
import { TitleComponent } from '@components/shared/title/title.component';
import { Permissions } from '@utils/permissions';
import {
  AlertModule,
  ButtonModule,
  FormHelperService,
  IconButtonModule,
  TooltipDirective,
} from 'logical-growth-components';

@Component({
  selector: 'app-list',
  imports: [
    TitleComponent,
    ButtonModule,
    ParagraphComponent,
    TagComponent,
    IconButtonModule,
    TooltipDirective,
    LoaderComponent,
    CardComponent,
    CurrencyPipe,
    AlertModule,
    TitleCasePipe,
  ],
  templateUrl: './list.component.html',
})
export class ListComponent extends Permissions implements OnInit {
  public loading = signal<boolean>(false);
  public id: string | null = null;
  public form!: FormGroup;

  constructor(
    public roomsService: RoomsService,
    public formHelper: FormHelperService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    super();
    this.id = this._activatedRoute.snapshot.params['idHotel'];
  }

  ngOnInit(): void {
    this._fetchData();
  }

  private _fetchData(): void {
    this.loading.set(true);
    this.id &&
      this.roomsService.getCollection(this.id).subscribe({
        next: () => {
          this.loading.set(false);
        },
      });
  }

  public colorTag(value: boolean): string {
    return value ? 'green' : 'red';
  }

  public contentTag(value: boolean): string {
    return value ? 'Activo' : 'Inactivo';
  }

  public changeStatus(id: string, status: boolean): void {
    this.roomsService.updateRoom(id, { enabled: status }).subscribe({
      next: () => {
        this._fetchData();
      },
    });
  }

  public goCreate(): void {
    this._router.navigate(['/app/habitaciones/crear', this.id]);
  }

  public goEdit(idRoom: string): void {
    this._router.navigate(['/app/habitaciones/editar', this.id, idRoom]);
  }

  public goReserve(idRoom: string): void {
    this._router.navigate(['/app/reservaciones/crear', idRoom]);
  }
}
