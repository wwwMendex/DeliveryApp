import { FirebaseProvider } from './../../providers/firebase';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalhesItemPage } from '../detalhes-item/detalhes-item.page';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.page.html',
  styleUrls: ['./cardapio.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardapioPage implements OnInit {
  tipo_cardapio: any;
  cardapio: any;
  cardapio_especiais: any;
  cardapio_tradicionais: any;
  header_title: String;
  footer: number = 1;
  user:any;
  private skeleton = Array(10);
  constructor(
    private modalCtrl: ModalController,
    private firebaseProvider: FirebaseProvider, 
    private route: ActivatedRoute, 
    private router: Router,
    private storage: Storage,
    private fcm: FCM,
    private toastCtrl: ToastController,
    
    ) { 
      setInterval(() => this.atualizarFooter(), 2000);
  }

   async ngOnInit() {
    this.user = await this.getUsuario();
    this.route.params.subscribe( parametros => {
      if (parametros['id']) {
        this.getCardapio(parametros['id']);
      }
    });
    this.atualizarFooter();
    this.fcm.onNotification().subscribe(data =>{  
      this.toastCtrl.create({
        message: 'O status do seu pedido foi atualizado!',
        duration: 2000,
        position: "bottom",
        color: "danger"
      }).then((toast) => toast.present());
    });
  }

  async getCardapio(id){
    const res = await this.firebaseProvider.getCardapio(id);
    this.cardapio = res;    
    this.defineTemplate(id);
  }
  async getUsuario(){
    let user = await this.storage.get('user');
    let userAtt = await this.firebaseProvider.getUser(user['uid']);
    return userAtt.data();
  }
  defineTemplate(id){
    switch (id){
      case '1':
        this.tipo_cardapio = 1;
        this.header_title = "Pizzas Salgadas";
        this.cardapio_especiais = this.cardapio.filter((obj) => { return obj.sub_type == "Pizzas especiais"});
        this.cardapio_tradicionais = this.cardapio.filter((obj) => { return obj.sub_type == "Pizzas tradicionais"});
        break;
      case '2':
        this.tipo_cardapio = 2;
        this.header_title = "Pizzas Doces";
        break;
      case '3':
        this.tipo_cardapio = 3;
        this.header_title = "Bebidas";
        break;
    }
  }
  goToHome(){
    this.router.navigateByUrl('home');
  }

  async detalhesItem(id){
    const item = this.cardapio.filter((obj) => { return obj.id == id});
    const pontos = this.user.pontos_fidelidade;
    const modal = await this.modalCtrl.create({
      component: DetalhesItemPage,
      componentProps: {item, pontos},
      swipeToClose: true,
      cssClass: "modal",
    });
    modal.onDidDismiss()
    .then(() => {
      this.storage.get('pedido')
      .then((res) => this.footer = (res && res.length > 0 ? 1 : 2));
      
    });
    return await modal.present();
  }
  async atualizarFooter(){
    const pedidoEfetuado = await this.storage.get('pedidoEfetuado');
    const pedidoAberto = await this.storage.get('pedido');
    if(pedidoEfetuado && pedidoEfetuado != "" && (!pedidoAberto || pedidoAberto.length == 0)){
      this.footer = 2;
    }else{
      this.footer = 1;
    }
  }

  
}
