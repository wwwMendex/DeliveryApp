import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseProvider } from 'src/providers/firebase';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  pedido:any;
  id:any;
  constructor(
    private modalCtrl: ModalController,
    private fb: FirebaseProvider,
    private storage: Storage
  ) { 
    setInterval(()=>this.atualizarPedido(this.id),240000); // atualiza de 4 em 4 min automaticamente
  }

  async ngOnInit() {
    this.id = await this.storage.get('pedidoEfetuado')
    this.atualizarPedido(this.id); 
  }

  doRefresh(event) {
    setTimeout(() => {
      this.atualizarPedido(this.id).then(()=> event.target.complete());
    }, 500);
  }

  async atualizarPedido(id){
    let pedido = await this.fb.getPedido(id);
    pedido['horario_pedido'] = new Date(pedido['horario_pedido'] * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if(pedido['horario_entrega'] != null){
      pedido['horario_entrega'] = new Date(pedido['horario_entrega'] * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    pedido['pedido'] = pedido['pedido'].split(', ');
    this.pedido = pedido;
    if(pedido['status']==4){
      this.storage.remove('pedidoEfetuado');
      this.closeModal();
    }
  }
  async closeModal(){
    await this.modalCtrl.dismiss();
  }
}
