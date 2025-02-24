import { KeyValuePipe, Location, NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationsService } from '@API/reservations/reservations.service';
import { AlertModule, ButtonModule, DateInputModule, FormHelperService, NumberInputModule, SelectInputModule, TextInputModule } from 'logical-growth-components';
import { TitleComponent } from "@components/shared/title/title.component";
import { DOCUMENT_TYPES, GENDER_OPTIONS } from '@utils/constants';
import { notification } from '@utils/notifications';
import { RoomsService } from '@API/rooms/rooms.service';
import { roomsData } from '@interfaces/rooms/hotels.interface';
import { LoaderComponent } from "@components/shared/loader/loader.component";

@Component({
  selector: 'app-create',
  imports: [TitleComponent, ReactiveFormsModule, TextInputModule, NumberInputModule, AlertModule, ButtonModule, DateInputModule, SelectInputModule, KeyValuePipe, NgFor, LoaderComponent],
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
  public id: string | null = null;
  public form!: FormGroup;
  public loading = signal<boolean>(false);
  public loadingContent = signal<boolean>(true);
  public documentTypes = DOCUMENT_TYPES;
  public genders = GENDER_OPTIONS;
  public roomInfo!: roomsData;
  public castToFG = (c: AbstractControl) => c as FormGroup

  constructor(
    private _fb: FormBuilder,
    private _reservationsService: ReservationsService,
    private _roomsService: RoomsService,
    public formHelper: FormHelperService,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _router: Router
  ) {
    this.id = this._activatedRoute.snapshot.params['id'];
    this._initializeForm();
  }

  ngOnInit(): void {
    this._fetchData();
  }

  private _fetchData(): void {
    if (this.id) {
      this._roomsService.getRoomById(this.id).subscribe({
        next: (response) => {
          this.roomInfo = response;
          this.loadingContent.set(false);
        },
        error: () => {
          this.loadingContent.set(false);
        }
      });
    }
  }

  get passengers() {
    return this.form.get('passengers') as FormArray;
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
    this.form = this._fb.group({
      passengers: this._fb.array([this._initializePassengerForm()]),
      contact_emergency_name: [null, Validators.required],
      contact_emergency_phone: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    });
  }

  private _initializePassengerForm(): FormGroup {
    return this._fb.group({
      id: [null],
      name: [null, Validators.required],
      birthdate: [null, Validators.required],
      gender: [true, Validators.required],
      document: [null, Validators.required],
      document_type: [true, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    });
  }

  public sendReservation(): void {
    this.formHelper.handleSubmit({
      form: this.form,
      selector: '.error',
      callback: (value) => {
        this.loading.set(true);
        value.roomId = this.id;
        this._reservationsService.addReservation(value).subscribe({
          next: () => {
            this.loading.set(false);
/*             this._sendMail(); */
            notification.fire({
              title: 'Reservación',
              text: 'Se ha reservado correctamente',
              type: 'success',
            });
            this._router.navigate(['/app/reservaciones/lista']);
          },
          error: () => {
            this.loading.set(false);
          }
        })
      },
    });
  }

/*   private _sendMail(): void {
    const resend = new Resend('re_TdjHTd7R_FQgarWbSdCiouq1KxMF334W5');
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'medina2432@gmail.com',
      subject: 'Confirmación de reserva',
      html: '<p>Felicitaciones, has reservado tu habitación con Hoteles Smart, ¡esperamos verte pronto!</p>'
    });
  } */

  public goBack(): void {
    this._location.back();
  }
}
