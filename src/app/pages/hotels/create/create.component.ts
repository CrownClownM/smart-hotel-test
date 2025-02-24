import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelsService } from '@API/hotels/hotels.service';
import {
  AlertModule,
  ButtonModule,
  FileInputModule,
  FormHelperService,
  SwitchInputModule,
  TextInputModule,
} from 'logical-growth-components';
import { TitleComponent } from '@components/shared/title/title.component';
import { notification } from '@utils/notifications';
import { ParagraphComponent } from "../../../components/shared/paragraph/paragraph.component";

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    TextInputModule,
    FileInputModule,
    ButtonModule,
    TitleComponent,
    AlertModule,
    SwitchInputModule,
    ParagraphComponent
],
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  public id: string | null = null;
  public form!: FormGroup;
  public loading = signal<boolean>(false);

  constructor(
    private _fb: FormBuilder,
    private _hotelService: HotelsService,
    public formHelper: FormHelperService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.id = this._activatedRoute.snapshot.params['id'];
    this._initializeForm();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  public fetchData(): void {
    if (this.id) {
      this._hotelService.getHotelById(this.id).subscribe({
        next: (response) => {
          this.form.patchValue(response);
        },
      });
    }
  }

  private _initializeForm(): void {
    this.form = this._fb.group({
      name: [null, Validators.required],
      location: [null, Validators.required],
      enabled: [true, Validators.required],
      image: [null, Validators.required],
    });
  }

  public sendHotel(): void {
    this.formHelper.handleSubmit({
      form: this.form,
      selector: '.error',
      callback: (value) => {
        this.loading.set(true);
        this.id ? this.updateHotel(value) : this.createHotel(value);
      },
    });
  }

  public createHotel(value: any): void {
    const image = value.image;
    delete value.image;
    this._hotelService.addHotel(value, image).subscribe({
      next: () => {
        notification.fire({
          title: 'Hotel',
          text: 'Se ha creado el hotel correctamente',
          type: 'success',
        });
        this._router.navigate(['/app/hoteles/lista']);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  public updateHotel(value: any): void {
    const image = value.image;
    delete value.image;
    this.id &&
      this._hotelService.updateHotel(this.id, value, image).subscribe({
        next: () => {
          notification.fire({
            title: 'Hotel',
            text: 'Se ha actualizado el hotel correctamente',
            type: 'success',
          });
          this._router.navigate(['/app/hoteles/lista']);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  public goBack(): void {
    this._router.navigate(['/app/hoteles/lista']);
  }
}
