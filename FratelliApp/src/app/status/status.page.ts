import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    private fcm : FCM
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
      pedido['horario_pedido'] = new Date(pedido['horario_pedido'] * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      if(pedido['horario_entrega'] != null){
        pedido['horario_entrega'] = new Date(pedido['horario_entrega'] * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
      pedido['pedido'] = pedido['pedido'].split(', ');
      this.pedidos[index] = pedido;
      if(pedido['status']==4){
        pedidoAberto--;
        if(pedidoAberto == 0){
          this.storage.remove('pedidoEfetuado');
          this.closeModal();
        }
      }
      index --;
    });
    
    
    
    
    
    
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
