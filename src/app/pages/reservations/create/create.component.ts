import { formatDate, KeyValuePipe, Location, NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationsService } from '@API/reservations/reservations.service';
import {
  AlertModule,
  ButtonModule,
  DateInputModule,
  FormHelperService,
  NumberInputModule,
  SelectInputModule,
  TextInputModule,
} from 'logical-growth-components';
import { TitleComponent } from '@components/shared/title/title.component';
import { DOCUMENT_TYPES, GENDER_OPTIONS } from '@utils/constants';
import { notification } from '@utils/notifications';
import { RoomsService } from '@API/rooms/rooms.service';
import { roomsData } from '@interfaces/rooms/rooms.interface';
import { LoaderComponent } from '@components/shared/loader/loader.component';
import { Permissions } from '@utils/permissions';
import { switchMap } from 'rxjs';
import { HotelsService } from '@API/hotels/hotels.service';
import { hotelsData } from '@interfaces/hotels/hotels.interface';
import { rangeDateValidator } from '@utils/validators/date-range.validator';
import { minDate } from '@utils/validators/min-date.validator';
import { maxDate } from '@utils/validators/max-date.validator';
import { EmailService } from '@utils/services/email.service';

@Component({
  selector: 'app-create',
  imports: [
    TitleComponent,
    ReactiveFormsModule,
    TextInputModule,
    NumberInputModule,
    AlertModule,
    ButtonModule,
    DateInputModule,
    SelectInputModule,
    KeyValuePipe,
    NgFor,
    LoaderComponent,
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent extends Permissions implements OnInit {
  public id: string | null = null;
  public startDate: string | null = null;
  public endDate: string | null = null;
  public form!: FormGroup;
  public loading = signal<boolean>(false);
  public loadingContent = signal<boolean>(true);

  public documentTypes = DOCUMENT_TYPES;
  public genders = GENDER_OPTIONS;
  public roomInfo!: roomsData;
  public hotelInfo!: hotelsData;

  public castToFG = (c: AbstractControl) => c as FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _reservationsService: ReservationsService,
    private _hotelService: HotelsService,
    private _roomsService: RoomsService,
    public formHelper: FormHelperService,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _emailService: EmailService
  ) {
    super();
    this.id = this._activatedRoute.snapshot.params['id'];
    this.startDate = this._activatedRoute.snapshot.params['start'];
    this.endDate = this._activatedRoute.snapshot.params['end'];
    this._initializeForm();
  }

  ngOnInit(): void {
    this._fetchData();
  }

  private _fetchData(): void {
    if (this.id) {
      this._roomsService
        .getRoomById(this.id)
        .pipe(
          switchMap((response: roomsData) => {
            this.roomInfo = response;
            this.loadingContent.set(false);
            return this._hotelService.getHotelById(response.hotelId);
          })
        )
        .subscribe({
          next: (hotelResponse) => {
            this.hotelInfo = hotelResponse;
          },
          error: () => {
            this.loadingContent.set(false);
          },
        });
    }
  }

  get passengers() {
    return this.form.get('passengers') as FormArray;
  }

  public minDate(): string {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  public addPassengers() {
    this.passengers.push(this._initializePassengerForm());
    this.passengers.controls.forEach((passengerGroup, index) => {
      passengerGroup.get('id')?.setValue(String(index + 1));
    });
  }

  public removePassenger(index: number) {
    this.passengers.removeAt(index);
  }

  private _initializeForm(): void {
    this.form = this._fb.group(
      {
        passengers: this._fb.array([this._initializePassengerForm()]),
        contact_emergency_name: [null, Validators.required],
        contact_emergency_phone: [
          null,
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.minLength(10),
          ],
        ],
        start_date: [{value: this.startDate,  disabled: true}, [Validators.required, minDate(this.minDate())]],
        end_date: [{value: this.endDate, disabled: true}, [Validators.required, minDate(this.minDate())]],
      },
      { validator: rangeDateValidator }
    );
  }

  private _initializePassengerForm(): FormGroup {
    return this._fb.group({
      id: [null],
      name: [null, Validators.required],
      birthdate: [null, [Validators.required, maxDate(this.minDate())]],
      gender: [true, Validators.required],
      document: [null, [Validators.required, Validators.minLength(6)]],
      document_type: [true, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
    });
  }

  public sendReservation(): void {
    this.formHelper.handleSubmit({
      form: this.form,
      selector: '.error',
      callback: (value) => {
        this.loading.set(true);
        value.roomId = this.id;
        value.room = this.roomInfo.name;
        value.price = this.roomInfo.price + this.roomInfo.taxes;
        value.hotel = this.hotelInfo.name;
        value.userId = this.user.user.uid;
        this._createReservation(value);
      },
    });
  }

  private _createReservation(value: any): void {
    this._reservationsService.addReservation(value).subscribe({
      next: () => {
        this.loading.set(false);
        this._sendMail();
        notification.fire({
          title: 'Reservación',
          text: 'Se ha realizado la reservación correctamente',
          type: 'success',
        });
        this._router.navigate(['/app/reservaciones/lista']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private _sendMail(): void {
    this._emailService.sendEmail(
      this.user.user.email,
      'Confirmación de reserva',
      'Felicitaciones, has reservado tu habitación con Hoteles Smart, ¡esperamos verte pronto!',
    ).subscribe({
      next: () => {
        notification.fire({
          title: 'Reservación',
          text: 'Se ha enviado un correo de confirmación',
          type: 'success',
        });
      },
      error: () => {
        notification.fire({
          title: 'Reservación',
          text: 'No se ha podido enviar el correo de confirmación',
          type: 'error',
        });
      },
    });
  }

  public goBack(): void {
    this._location.back();
  }
}
