import { FirebaseProvider } from './../../providers/firebase';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalhesItemPage } from '../detalhes-item/detalhes-item.page';


@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.page.html',
  styleUrls: ['./cardapio.page.scss'],
})
export class CardapioPage implements OnInit {
  tipo_cardapio: any;
  cardapio: any;
  cardapio_especiais: any;
  cardapio_tradicionais: any;
  header_title: String;
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private firebaseProvider: FirebaseProvider, 
    private route: ActivatedRoute, 
    private router: Router,
    private loadingController: LoadingController
    ) { 
  
  }

   async ngOnInit() {
    this.loading = await this.loadingController.create();
    this.loading.present();
    this.route.params.subscribe( parametros => {
      if (parametros['id']) {
        this.getCardapio(parametros['id']);
      }
    });
  }

  async getCardapio(id){
    const res = await this.firebaseProvider.getCardapio(id);
    this.cardapio = res;
    this.defineTemplate(id);
  }
  defineTemplate(id){
    switch (id){
      case '1':
        this.tipo_cardapio = 1;
        this.header_title = "Pizzas Salgadas";
        this.cardapio_especiais = this.cardapio.filter((obj) => { return obj.sub_type == "Pizzas especiais"});
        this.cardapio_tradicionais = this.cardapio.filter((obj) => { return obj.sub_type == "Pizzas tradicionais"});
        this.loading.dismiss();
        break;
      case '2':
        this.tipo_cardapio = 2;
        this.header_title = "Pizzas Doces";
        this.loading.dismiss();
        break;
      case '3':
        this.tipo_cardapio = 3;
        this.header_title = "Bebidas";
        this.loading.dismiss();
        break;
    }
  }
  goToHome(){
    this.router.navigateByUrl('home');
  }

  async detalhesItem(id){
    const item = this.cardapio.filter((obj) => { return obj.id == id});
    const modal = await this.modalCtrl.create({
      component: DetalhesItemPage,
      componentProps: {item},
      swipeToClose: true,
      cssClass: "modal",
    });

    return await modal.present();
  }
  
}