import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, doc, docData, Firestore, getDocs } from '@angular/fire/firestore';
import { reservationsData } from '@interfaces/reservations/reservations.interface';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private _firestore = inject(Firestore);

  private _reservationsList$ = signal<reservationsData[]>([]);
  public reservationsList$ = this._reservationsList$.asReadonly();

  public getCollection() {
    const ref = collection(this._firestore, 'reservations');
    return from(getDocs(ref)).pipe(
      map((snapshot) => {
        const rooms: reservationsData[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<reservationsData, 'id'>;
          return { id: doc.id, ...data };
        });
        this._reservationsList$.set(rooms);
        return rooms;
      })
    );
  }

  public getReservationById(id: string): Observable<any> {
    const reservationsRef = doc(this._firestore, `reservations/${id}`);
    return docData(reservationsRef, { idField: 'id' });
  }

  public addReservation(reservation: any): Observable<any> {
    const reservationsRef = collection(this._firestore, 'reservations');
    return from(addDoc(reservationsRef, reservation));
  }
}
