import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  docData,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { roomsData } from '@interfaces/rooms/rooms.interface';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private _firestore = inject(Firestore);
  private _storage = inject(Storage);

  private _roomsList$ = signal<roomsData[]>([]);
  public roomsList$ = this._roomsList$.asReadonly();

  public getCollection(hotelId: string) {
    const ref = collection(this._firestore, 'rooms');
    const q = query(ref, where('hotelId', '==', hotelId));
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const rooms: roomsData[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<roomsData, 'id'>;
          return { id: doc.id, ...data };
        });
        this._roomsList$.set(rooms);
        return rooms;
      })
    );
  }

  public getRoomById(id: string): Observable<any> {
    const roomRef = doc(this._firestore, `rooms/${id}`);
    return docData(roomRef, { idField: 'id' });
  }

  public addRoom(room: any, file: File): Observable<any> {
    const roomsRef = collection(this._firestore, 'rooms');
    return this._uploadRoomImage(file, room.name).pipe(
      switchMap((imageUrl) => {
        return addDoc(roomsRef, { ...room, imageUrl });
      })
    );
  }

  public updateRoom(
    id: string,
    updatedData: any,
    file?: File
  ): Observable<void> {
    const hotelRef = doc(this._firestore, `rooms/${id}`);
    return this._uploadRoomImage(file, id).pipe(
      switchMap((imageUrl) => {
        const newData = imageUrl ? { ...updatedData, imageUrl } : updatedData;
        return from(updateDoc(hotelRef, newData));
      })
    );
  }

  private _uploadRoomImage(
    file?: File,
    roomId?: string
  ): Observable<string | null> {
    if (!file || !roomId) return of(null);
    const filePath = `rooms/${roomId}/${file.name}`;
    const storageRef = ref(this._storage, filePath);
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(() => from(getDownloadURL(storageRef)))
    );
  }
}
