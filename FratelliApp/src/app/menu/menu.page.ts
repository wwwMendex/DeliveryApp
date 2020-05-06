import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseProvider } from 'src/providers/firebase';
import { EnderecosPage } from '../enderecos/enderecos.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  user:any = {
    email : '',
    name : '',
    pontos_fidelidade : 0,
    tel : '',
    uid : ''
  };
  pedidos:any= [];

  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private router: Router,
    private firebaseProvider: FirebaseProvider
  ) { }

  async ngOnInit() {
    this.user = await this.storage.get('user');
    this.pedidos = await this.firebaseProvider.getUltimosPedidos(this.user.uid);
    this.pedidos.forEach(pedido => {
      pedido.pedido = pedido.pedido.split(', ');
      pedido.data_pedido = new Date(pedido.data_pedido.seconds * 1000).toLocaleDateString('pt-BR');
    });
  }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }
  async abrirEndereco(){
    const modal = await this.modalCtrl.create({
      component: EnderecosPage,
      swipeToClose: true,
    });
    return await modal.present();
  }
  logout(){
    this.storage.remove('user');
    this.storage.remove('pedido');
    this.router.navigateByUrl('auth');
    this.closeModal();
  }

}
