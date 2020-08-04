import { Injectable } from "@angular/core";
import {
  AngularFirestore,
} from "@angular/fire/firestore";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { notificationKey } from 'src/environments/environment';
import { resolve } from 'dns';



@Injectable()
export class FirebaseProvider {
  constructor(
    private afs: AngularFirestore,
    private http: HttpClient
  ) {
    
  }

  atualizarPedido = data =>
  this.afs
    .collection("Pedidos")
    .doc(data.id)
    .set(data);

  criarSlide = data =>
  this.afs
    .collection("Slides")
    .doc(data.id)
    .set(data);
  
  deleteSlide = id =>
  this.afs
    .collection("Slides")
    .doc(id)
    .delete();

  criarCupom = data =>
  this.afs
    .collection("Cupom")
    .doc(data.id)
    .set(data);

  deleteCupom = id =>
  this.afs
    .collection("Cupom")
    .doc(id)
    .delete();

  setStatus = status =>
  this.afs
    .collection("Status")
    .doc('status')
    .set(status);
    
  setTarifa = data =>
  this.afs
    .collection("Tarifa")
    .doc(data.id)
    .set(data);

  deleteTarifa = id =>
  this.afs
    .collection("Tarifa")
    .doc(id)
    .delete();

  criarItem = data => {
    switch(data.type){
      case 'salgada':
        this.afs
          .collection("Cardapio")
          .doc('pizzas')
          .collection('salgadas')
          .doc(data.id)
          .set(data);
        return;
      case 'doce':
        this.afs
          .collection("Cardapio")
          .doc('pizzas')
          .collection('doces')
          .doc(data.id)
          .set(data);
        return;
      case 'bebida':
        this.afs
          .collection("Cardapio")
          .doc('bebidas')
          .collection('options')
          .doc(data.id)
          .set(data);
        return;
    }
  }
  deleteItem = data => {
    switch(data.type){
      case 'salgada':
        this.afs
          .collection("Cardapio")
          .doc('pizzas')
          .collection('salgadas')
          .doc(data.id)
          .delete();
        return;
      case 'doce':
        this.afs
          .collection("Cardapio")
          .doc('pizzas')
          .collection('doces')
          .doc(data.id)
          .delete();
        return;
      case 'bebida':
        this.afs
          .collection("Cardapio")
          .doc('bebidas')
          .collection('options')
          .doc(data.id)
          .delete();
        return;
    }
  }

  getAllPedidoByStatus(status) {
    return new Promise((resolve, reject) => {
      let promise = [];
      let array = [];
      promise.push(this.afs.firestore.collection('Pedidos')
      .orderBy('horario_pedido', 'asc')
      .where("status", "==",status)
      .get()
      .then((r) => {
        r.forEach((d) => {
          let item = d.data();
          array.push(item);
        });
      }));
      Promise.all(promise).then(() => resolve(array));
    });
  }

  getCardapio(){
    return new Promise((resolve, reject) => {
      let arraySalgadas = [];
      let arrayDoces = [];
      let arrayBebidas = [];
      let promisses = [];
      promisses.push(this.afs.firestore.collection('Cardapio').doc('pizzas').collection('salgadas').get()
        .then((r) => {
          r.forEach((d) => {
            let item = d.data();
            arraySalgadas.push(item);
          });
        }));
      
      promisses.push(this.afs.firestore.collection('Cardapio').doc('pizzas').collection('doces').get()
        .then((r) => {
          r.forEach((d) => {
            let item = d.data();
            arrayDoces.push(item);
          });
        }));
      promisses.push(this.afs.firestore.collection('Cardapio').doc('bebidas').collection('options').get()
        .then((r) => {
          r.forEach((d) => {
            let item = d.data();
            arrayBebidas.push(item);
          });
        }));
        Promise.all(promisses).then(() => resolve([arraySalgadas, arrayDoces, arrayBebidas])); 
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
  getCupons(){
    return new Promise((resolve, reject) =>{
      this.afs.firestore.collection('Cupom').get()
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
  getStatus(){
    return new Promise((resolve, reject) =>{
      this.afs.firestore.collection('Status').doc('status').get()
      .then((r) => {
        resolve(r.data());
      });
    });
  }

  getTarifas(){
    return new Promise((resolve, reject) =>{
      this.afs.firestore.collection('Tarifa').get()
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

  atualizarPontos(uid: string, pontos: number){
    this.afs.firestore.collection('Users').doc(uid).get()
    .then((r) => {
      let user = r.data();
      user.pontos_fidelidade += pontos;        
      this.afs
        .collection("Users")
        .doc(uid)
        .set(user);
    });
    return;
  }

  enviarPush(titulo, desc, token){
    if(token){
      let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':notificationKey});
      const url = 'https://fcm.googleapis.com/fcm/send';
      const body = JSON.stringify({
        "notification":{
          "title" : titulo,
          "body" : desc,
          "icon" : "fcm_push_icon"
        },
        "to" : token,
      });
      return this.http.post(
        url, 
        body, 
        { headers: headers}
      ).subscribe(
        data => console.log(data => console.log(data))
      );
    }
  }

}

  