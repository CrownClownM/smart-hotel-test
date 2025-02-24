import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { routes } from '@routes/app.routes';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'hotel-accommodation-management',
        appId: '1:782145609271:web:ce7e270ab1db58c7aaa9b2',
        databaseURL:
          'https://hotel-accommodation-management-default-rtdb.firebaseio.com',
        storageBucket: 'hotel-accommodation-management.firebasestorage.app',
        apiKey: 'AIzaSyBeHKjpn9s4W7em2xrZZ5iF8lk7kTKeUBQ',
        authDomain: 'hotel-accommodation-management.firebaseapp.com',
        messagingSenderId: '782145609271',
      })
    ), provideFirebaseApp(() => initializeApp({ projectId: "hotel-accommodation-management", appId: "1:782145609271:web:ce7e270ab1db58c7aaa9b2", databaseURL: "https://hotel-accommodation-management-default-rtdb.firebaseio.com", storageBucket: "hotel-accommodation-management.firebasestorage.app", apiKey: "AIzaSyBeHKjpn9s4W7em2xrZZ5iF8lk7kTKeUBQ", authDomain: "hotel-accommodation-management.firebaseapp.com", messagingSenderId: "782145609271" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "hotel-accommodation-management", appId: "1:782145609271:web:ce7e270ab1db58c7aaa9b2", databaseURL: "https://hotel-accommodation-management-default-rtdb.firebaseio.com", storageBucket: "hotel-accommodation-management.firebasestorage.app", apiKey: "AIzaSyBeHKjpn9s4W7em2xrZZ5iF8lk7kTKeUBQ", authDomain: "hotel-accommodation-management.firebaseapp.com", messagingSenderId: "782145609271" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()),

  ],
};
