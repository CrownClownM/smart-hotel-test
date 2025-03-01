import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '@API/rooms/rooms.service';
import {
  AlertModule,
  ButtonModule,
  FileInputModule,
  FormHelperService,
  NumberInputModule,
  SwitchInputModule,
  TextInputModule,
} from 'logical-growth-components';
import { Location } from '@angular/common';
import { TitleComponent } from '@components/shared/title/title.component';
import { notification } from '@utils/notifications';
import { ParagraphComponent } from "../../../components/shared/paragraph/paragraph.component";
import { HotelsService } from '@API/hotels/hotels.service';
import { hotelsData } from '@interfaces/hotels/hotels.interface';

@Component({
  selector: 'app-create',
  imports: [
    TextInputModule,
    AlertModule,
    FileInputModule,
    SwitchInputModule,
    ButtonModule,
    TitleComponent,
    ReactiveFormsModule,
    NumberInputModule,
    ParagraphComponent
],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  public id: string | null = null;
  public idHotel: string | null = null;
  public hotelData!: hotelsData;
  public form!: FormGroup;
  public loading = signal<boolean>(false);

  constructor(
    private _fb: FormBuilder,
    private _hotelService: HotelsService,
    private _roomsService: RoomsService,
    public formHelper: FormHelperService,
    private _activatedRoute: ActivatedRoute,
    private _location: Location
  ) {
    this.idHotel = this._activatedRoute.snapshot.params['idHotel'];
    this.id = this._activatedRoute.snapshot.params['idRoom'];
    this._initializeForm();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  public fetchData(): void {
    if (this.id) {
      this._roomsService.getRoomById(this.id).subscribe({
        next: (response) => {
          this.form.patchValue(response);
        },
      });
      this._setValidators();
    }
    this._hotelService.getHotelById(this.idHotel!).subscribe({
      next: (response) => {
        this.hotelData = response;
      },
    });
  }
  private _setValidators() {
    this.form.get('image')?.clearValidators();
    this.form.get('image')?.updateValueAndValidity();
  }

  private _initializeForm(): void {
    this.form = this._fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      taxes: [null, Validators.required],
      enabled: [true, Validators.required],
      quantity: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  public sendRoom(): void {
    this.formHelper.handleSubmit({
      form: this.form,
      selector: '.error',
      callback: (value) => {
        const image = value.image;
        delete value.image;
        this.id ? this.updateRoom(value, image) : this.createRoom(value, image);
      },
    });
  }

  public createRoom(value: any, image: any): void {
    value.hotelId = this.idHotel;
    value.location = this.hotelData.location;
    this._roomsService.addRoom(value, image).subscribe({
      next: () => {
        notification.fire({
          title: 'Habitación',
          text: 'Se ha creado la habitación correctamente',
          type: 'success',
        });
        this._location.back();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  public updateRoom(value: any, image: any): void {
    this.id &&
      this._roomsService.updateRoom(this.id, value, image).subscribe({
        next: () => {
          notification.fire({
            title: 'Habitación',
            text: 'Se ha actualizado la habitación correctamente',
            type: 'success',
          });
          this._location.back();
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  public goBack(): void {
    this._location.back();
  }
}
