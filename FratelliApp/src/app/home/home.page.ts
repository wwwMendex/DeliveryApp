import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FirebaseProvider } from './../../providers/firebase';
import { MenuPage } from '../menu/menu.page';
import { slideInAnimation, slideOutAnimation } from '../animations/slideAnimation'
import { EnderecosPage } from '../enderecos/enderecos.page';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  slides: any = [];
  endereco: any = null;
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private firebaseProvider: FirebaseProvider,
    private storage: Storage
   
  ) { 
    
  }
  
  async ngOnInit() {
    this.endereco = await this.getEndereco();
    this.slides = await this.getSlides();
  }
  async getSlides(){
    return await this.firebaseProvider.getSlides();
  }

  async getEndereco(){
    let enderecos = await this.storage.get('endereco');
    if(enderecos && enderecos.cadastrados.length > 0){
      let selecionado = enderecos.cadastrados.findIndex((end:any) => {return end.id == enderecos.selecionado});
      return enderecos.cadastrados[selecionado];
    } else {
      return null;
    }
  }

  async abrirMenu(){
    const modalMenu = await this.modalCtrl.create({
      component: MenuPage,
      swipeToClose: true,
      enterAnimation: slideInAnimation,
      leaveAnimation: slideOutAnimation,
      cssClass: "modal-menu",
    });
    return await modalMenu.present();
  }
  async abrirEndereco(){
    const modal = await this.modalCtrl.create({
      component: EnderecosPage,
      swipeToClose: true,
    });
    modal.onDidDismiss().then(async () => this.endereco = await this.getEndereco());
    return await modal.present();
  }

  
}
