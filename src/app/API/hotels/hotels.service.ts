import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, doc, docData, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { hotelsData } from '@interfaces/hotels/hotels.interface';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  private _firestore = inject(Firestore);
  private _storage = inject(Storage);

  private _hotelsList$ = signal<hotelsData[]>([]);
  public hotelsList$ = this._hotelsList$.asReadonly();

  public getCollection() {
    const ref = collection(this._firestore, 'hotels ');
    return from(getDocs(ref)).pipe(
/*       map((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      ) */
      map((snapshot) => {
        const rooms: hotelsData[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<hotelsData, 'id'>;
          return { id: doc.id, ...data };
        });
        this._hotelsList$.set(rooms);
        return rooms;
      })
    );
  }

  public getHotelById(id: string): Observable<any> {
    const hotelRef = doc(this._firestore, `hotels /${id}`);
    return docData(hotelRef, { idField: 'id' });
  }

  public addHotel(hotel: any, file: File): Observable<any> {
    const hotelsRef = collection(this._firestore, 'hotels ');
    return this._uploadHotelImage(file, hotel.name).pipe(
      switchMap((imageUrl) => {
        return addDoc(hotelsRef, { ...hotel, imageUrl });
      })
    );
  }

  public updateHotel(id: string, updatedData: any, file?: File): Observable<void> {
    const hotelRef = doc(this._firestore, `hotels /${id}`);
    return this._uploadHotelImage(file, id).pipe(
      switchMap((imageUrl) => {
        const newData = imageUrl ? { ...updatedData, imageUrl } : updatedData;
        return from(updateDoc(hotelRef, newData));
      })
    );
  }

  private _uploadHotelImage(file?: File, hotelId?: string): Observable<string | null> {
    if (!file || !hotelId) return of(null);
    const filePath = `hotels/${hotelId}/${file.name}`;
    const storageRef = ref(this._storage, filePath);
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(() => from(getDownloadURL(storageRef)))
    );
  }

}
