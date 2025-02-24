import { Component, DestroyRef, inject, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_FORM_ERRORS } from '@utils/app-errors';
import { notification } from '@utils/notifications';
import { initTheme } from '@utils/theme';
import { FormHelperService } from 'logical-growth-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-CO',
    },
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'hotel-management-smart-test';

  private _fh = inject(FormHelperService);
  private _destroyRef = inject(DestroyRef)

  constructor() {
    this.bootstrapServices();
    this._destroyRef.onDestroy(() => {
      window.removeEventListener('notification', notification.handler)
    })
  }

  bootstrapServices() {
    this._fh.setErrors(APP_FORM_ERRORS());
    notification.init({
      timer: 3000,
      autoclose: true,
      position: 'top-right'
    })
    initTheme();
  }
}
