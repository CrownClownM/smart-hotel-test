import { CurrencyPipe, formatDate, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '@API/rooms/rooms.service';
import { CardComponent } from '@components/shared/card/card.component';
import { LoaderComponent } from '@components/shared/loader/loader.component';
import { ParagraphComponent } from '@components/shared/paragraph/paragraph.component';
import { TagComponent } from '@components/shared/tag/tag.component';
import { TitleComponent } from '@components/shared/title/title.component';
import { notification } from '@utils/notifications';
import { Permissions } from '@utils/permissions';
import { rangeDateValidator } from '@utils/validators/date-range.validator';
import { minDate } from '@utils/validators/min-date.validator';
import {
  AlertModule,
  ButtonModule,
  CityInputModule,
  DateInputModule,
  FormHelperService,
  IconButtonModule,
  NumberInputModule,
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
    CityInputModule,
    DateInputModule,
    NumberInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './list.component.html',
})
export class ListComponent extends Permissions implements OnInit {
  public loading = signal<boolean>(false);
  public id: string | null = null;
  public isGeneralList: boolean = false;
  public form!: FormGroup;

  constructor(
    public roomsService: RoomsService,
    public formHelper: FormHelperService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    super();
    this.isGeneralList = this._router.url.includes('lista-habitaciones');
    this.id = this._activatedRoute.snapshot.params['idHotel'];
    this._initializeForm();
  }

  ngOnInit(): void {
    this._fetchData();
  }

  public minDate(): string {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  private _initializeForm() {
    const formConfig: any = {
      guests: [null, Validators.required],
      start_date: [null, [Validators.required, minDate(this.minDate())]],
      end_date: [null, [Validators.required, minDate(this.minDate())]]
    };
    if (this.isGeneralList) {
      formConfig.ubication = [null, Validators.required];
    }
    this.form = this._formBuilder.group(formConfig, { validator: rangeDateValidator });
  }

  private _fetchData(): void {
    this.loading.set(true);
    if (this.isGeneralList) {
      if (this.isAdmin) {
        this._obtainGeneralAdminRooms();
      } else {
        this._obtainGeneralRooms();
      }
      return;
    } else {
      if (this.isAdmin) {
        this._obtainAdminRooms();
      } else {
        this._obtainUserRooms();
      }
    }
  }


  private _obtainAdminRooms(): void {
    this.id &&
      this.roomsService.getCollection(this.id).subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  private _obtainUserRooms(): void {
    this.id &&
      this.roomsService.getUserCollection(this.id).subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  private _obtainGeneralAdminRooms(): void {
    this.roomsService.getGeneralAdminCollection().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private _obtainGeneralRooms(): void {
    this.roomsService.getGeneralCollection().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  public searchParams(): void {
    this.formHelper.handleSubmit({
      form: this.form,
      selector: '.error',
      callback: (value) => {
        this.loading.set(true);
        if(this.isGeneralList){
          this.roomsService.getAvailableRooms(value.ubication.city, value.guests, value.start_date, value.end_date, null).subscribe({
            next: () => {
              this.loading.set(false);
            },
            error: () => {
              this.loading.set(false);
            },
          });
        } else {
          this.id && this.roomsService.getAvailableRooms(null, value.guests, value.start_date, value.end_date, this.id).subscribe({
            next: () => {
              this.loading.set(false);
            },
            error: () => {
              this.loading.set(false);
            },
          });
        }
      }
    })
  }

  public clearSearch(): void {
    this._fetchData();
    this.form.reset();
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
        notification.fire({
          title: 'Habitación',
          text: 'Se ha cambiardo el estado correctamente',
          type: 'success',
        });
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      const { start_date, end_date } = this.form.value;
      this._router.navigate(['/app/reservaciones/crear', idRoom, start_date, end_date]);
    }
  }
}
