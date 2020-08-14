import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseProvider } from './../../providers/firebase';
import { MenuPage } from '../menu/menu.page';
import { slideInAnimation, slideOutAnimation } from '../animations/slideAnimation'
import { EnderecosPage } from '../enderecos/enderecos.page';
import { Storage } from '@ionic/storage';
import { StatusPage } from '../status/status.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  slides: any = [];
  endereco: any = null;
  pedidoEfetuado:any = false;
  footer: number=1;
  constructor(
    private modalCtrl: ModalController,
    private firebaseProvider: FirebaseProvider,
    private storage: Storage,
   
  ) { 
    setInterval(() => this.atualizarFooter(), 2000);
  }
  
  async ngOnInit() {
    this.endereco = await this.getEndereco();
    this.slides = await this.getSlides();
    this.atualizarFooter();
    
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
    const modalEnd = await this.modalCtrl.create({
      component: EnderecosPage,
      swipeToClose: true,
    });
    modalEnd.onDidDismiss().then(async () => this.endereco = await this.getEndereco());
    return await modalEnd.present();
  }

  async abrirStatus(){
    const modalStatus = await this.modalCtrl.create({
      component: StatusPage,
      swipeToClose: true,
    });
    return await modalStatus.present();
  }
  async atualizarFooter(){
    const pedidoEfetuado = await this.storage.get('pedidoEfetuado');
    if(pedidoEfetuado && pedidoEfetuado != ""){
      this.pedidoEfetuado = true;
    }else{
      this.pedidoEfetuado = false;
    }

    const pedidoAberto = await this.storage.get('pedido');
    if(this.pedidoEfetuado && (!pedidoAberto || pedidoAberto.length == 0)){
      this.footer = 2;
    }else{
      this.footer = 1;
    }
  }

  
}
