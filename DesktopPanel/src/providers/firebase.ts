import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";



@Injectable()
export class FirebaseProvider {
  constructor(private afs: AngularFirestore) {}
}