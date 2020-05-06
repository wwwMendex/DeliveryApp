import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FirebaseProvider } from './../../providers/firebase';
import { MenuPage } from '../menu/menu.page';
import { slideInAnimation, slideOutAnimation } from '../animations/slideAnimation'
import { EnderecosPage } from '../enderecos/enderecos.page';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  slides: any = [];
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private firebaseProvider: FirebaseProvider,
   
  ) { 
    this.getSlides();
  }
  
  ngOnInit() {
  }
  async getSlides(){
    const res = await this.firebaseProvider.getSlides();
    this.slides = res;
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
    return await modal.present();
  }

  
}
