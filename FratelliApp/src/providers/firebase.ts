import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { promise } from 'protractor';


@Injectable()
export class FirebaseProvider {
  constructor(private afs: AngularFirestore) {}


  //Create user on firestore
  postUser = data =>
    this.afs
      .collection("Users")
      .doc(data.uid)
      .set(data);

  getUser(uid){
    return this.afs.firestore.collection('Users').doc(uid)
    .get();
  }

  getUltimosPedidos(uid){
    return new Promise((resolve, reject) =>{ 
      this.afs.firestore.collection('Pedidos')
      .orderBy('data_pedido')
      .where("user_id", "==", uid)
      .limit(3)
      .get()
      .then((r) => {
        let array = [];
        r.forEach((d) => {
          let item = d.data();
          array.push(item);
        });
        resolve(array);
      });
    });
  }
  getSlides(){
    return new Promise((resolve, reject) =>{
      this.afs.firestore.collection('Slides').get()
      .then((r) => {
        let array = [];
        r.forEach((d) => {
          let item = d.data();
          array.push(item);
        });
        resolve(array);
      });
    });
  }
  getCardapio(id){
    switch(id){
      case '1': // Cardapio salgadas
        return new Promise((resolve, reject) =>{
          this.afs.firestore.collection('Cardapio').doc('pizzas').collection('salgadas').get()
          .then((r) => {
            let array = [];
            r.forEach((d) => {
              let item = d.data();
              array.push(item);
            });
            resolve(array);
          });
        });
      case '2': //cardapio doces
        return new Promise((resolve, reject) =>{
          this.afs.firestore.collection('Cardapio').doc('pizzas').collection('doces').get()
          .then((r) => {
            let array = [];
            r.forEach((d) => {
              let item = d.data();
              array.push(item);
            });
            resolve(array);
          });
        });
      case '3': //cardapio bebidas
        return new Promise((resolve, reject) =>{
          this.afs.firestore.collection('Cardapio').doc('bebidas').collection('options').get()
          .then((r) => {
            let array = [];
            r.forEach((d) => {
              let item = d.data();
              array.push(item);
            });
            resolve(array);
          });
        });
    }
  }
}
