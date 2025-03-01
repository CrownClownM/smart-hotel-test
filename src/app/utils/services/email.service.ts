import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private firestore: Firestore) {}

  public sendEmail(to: string, subject: string, text: string): Observable<void> {
    const emailData = {
      to,
      message: {
        subject,
        text,
        html: text,
      },
    };

    return from(addDoc(collection(this.firestore, 'mail'), emailData).then(() => {}));
  }
}
