import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FirebaseProvider } from './../../providers/firebase';
import { MenuPage } from '../menu/menu.page';
import { slideInAnimation, slideOutAnimation } from '../animations/slideAnimation'



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

  goToCardapioSalgadas(){
     this.router.navigateByUrl('cardapio/1');
  }
  goToCardapioDoces(){
    
     this.router.navigateByUrl('cardapio/2');
  }
  goToCardapioBebidas(){
     this.router.navigateByUrl('cardapio/3');
  }
  

  
}
