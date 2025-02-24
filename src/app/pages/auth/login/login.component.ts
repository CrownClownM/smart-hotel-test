import { Component, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@API/auth/auth.service';
import { LinkComponent } from '@components/shared/link/link.component';
import { TitleComponent } from '@components/shared/title/title.component';
import { notification } from '@utils/notifications';
import { storage } from '@utils/storage-handlers';
import {
  AlertModule,
  ButtonModule,
  FormHelperService,
  PasswordInputModule,
  TextInputModule,
} from 'logical-growth-components';

@Component({
  selector: 'app-login',
  imports: [
    TextInputModule,
    PasswordInputModule,
    ReactiveFormsModule,
    AlertModule,
    ButtonModule,
    TitleComponent,
    LinkComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public form: FormGroup;
  public isLogin = false;
  public loading = signal<boolean>(false);

  constructor(
    public formHelper: FormHelperService,
    private _router: Router,
    private _fb: FormBuilder,
    private authService: AuthService
  ) {
    this.isLogin = this._router.url.includes('inicio-sesion');
    this.form = this._initializeForm();
  }

  private _initializeForm(): FormGroup {
    return this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public validateMethod() {
    this.loading.set(true);
    this.isLogin ? this._logIn() : this._signUp();
  }

  private _logIn() {
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        storage.SET({ key: 'userData', value: data });
        notification.fire({
          title: 'Inicio de sesión',
          text: 'Bienvenido',
          type: 'success',
        });
        this._router.navigate(['/app/inicio']);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    })
  }

  private _signUp() {
    const { email, password } = this.form.value;
    this.authService.register(email, password, 'traveler').subscribe({
      next: () => {
        notification.fire({
          title: 'Registro',
          text: 'Se ha creado el usuario correctamente, inicia sesión',
          type: 'success',
        });
        this._router.navigate(['/auth/inicio-sesion']);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    })
  }
}
