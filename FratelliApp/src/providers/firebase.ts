import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";


@Injectable()
export class FirebaseProvider {
  constructor(private afs: AngularFirestore) {}


  //Create user on firestore
  postUser = data =>
    this.afs
      .collection("Users")
      .doc(data.uid)
      .set(data);
}