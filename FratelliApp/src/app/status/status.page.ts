import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FirebaseProvider } from 'src/providers/firebase';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  pedidos:any=[];
  id:any=[];
  constructor(
    private modalCtrl: ModalController,
    private fb: FirebaseProvider,
    private storage: Storage,
    private router: Router,
    private fcm : FCM,
    private alertCtrl: AlertController
  ) { 
    
  }

  async ngOnInit() {
    this.id = await this.storage.get('pedidoEfetuado');
    this.atualizarPedido(this.id);
    this.fcm.onNotification().subscribe(() => this.atualizarPedido(this.id));
  }

  doRefresh(event) {
    setTimeout(() => {
      this.atualizarPedido(this.id).then(()=> event.target.complete());
    }, 500);
  }

  async atualizarPedido(id){
    let pedidoAberto = id.length;
    let index = id.length -1;
    id.forEach(async ped => {
      let pedido = await this.fb.getPedido(ped);
      if(pedido['status'] > 1 && pedido['pagamento'] == 'pontos'){
        this.storage.remove('pedidoPontos');
      }
      
      this.pedidos[index] = pedido;
      if(pedido['status']>=4){
        pedidoAberto--;
        if(pedidoAberto == 0){
          this.storage.remove('pedidoEfetuado');
          this.closeModal();
        }
      }
      index --;
    });
  }

  async presentHelpAlert(){
    const alert = await this.alertCtrl.create({
      header: 'Ajuda',
      subHeader: "Alterações ou cancelamentos devem ser feitos com o restaurante. (11) 4033-2332",
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();

  }
  async closeModal(){
    try{
      await this.modalCtrl.dismiss();
    }
    catch(err){
      this.router.navigateByUrl('home');
    }
  }
}
