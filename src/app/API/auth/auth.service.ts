import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, UserCredential } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _auth: Auth, private _firestore: Firestore, private _router: Router) {}

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('userData')!);
    return user !== null;
  }

  public login(email: string, password: string): Observable<{ user: User; role: string }> {
    return from(signInWithEmailAndPassword(this._auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        const userRef = doc(this._firestore, `users/${userCredential.user.uid}`);
        return from(getDoc(userRef)).pipe(
          switchMap((userSnap) => {
            if (userSnap.exists()) {
              return of({ user: userCredential.user, role: userSnap.data()?.['role'] });
            } else {
              throw new Error('No se encontró el usuario en Firestore');
            }
          })
        );
      })
    );
  }

  public register(email: string, password: string, role: 'admin' | 'traveler'): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this._auth, email, password)).pipe(
      switchMap((userCredential) => {
        const userRef = doc(this._firestore, `users/${userCredential.user.uid}`);
        return from(setDoc(userRef, { email, role })).pipe(switchMap(() => of(userCredential)));
      })
    );
  }

  public logOut() {
    return this._auth.signOut().then(() => {
      localStorage.removeItem('userData');
      this._router.navigate(['/acceso/inicio-sesion']);
    })
  }

}
