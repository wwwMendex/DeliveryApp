import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
    private storage: Storage,
    private modalCtrl: ModalController,
  ) { 

  }

  ngOnInit() {
  }

  goToCardapioSalgadas(){
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 500,
      iosdelay: 100,
      androiddelay: 100,
      slowdownfactor: -1,
     }
     this.nativePageTransitions.slide(options);
     this.router.navigateByUrl('cardapio/1');
  }
  goToCardapioDoces(){
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 500,
      iosdelay: 100,
      androiddelay: 100,
      slowdownfactor: -1,
     }
     this.nativePageTransitions.slide(options);
     this.router.navigateByUrl('cardapio/2');
  }
  goToCardapioBebidas(){
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 500,
      iosdelay: 100,
      androiddelay: 100,
      slowdownfactor: -1,
     }
     this.nativePageTransitions.slide(options);
     this.router.navigateByUrl('cardapio/3');
  }
  logout(){
    this.storage.remove('user');
    this.router.navigateByUrl('auth');
  }

  
}
