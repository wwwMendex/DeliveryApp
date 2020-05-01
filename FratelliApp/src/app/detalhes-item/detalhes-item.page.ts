import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-detalhes-item',
  templateUrl: './detalhes-item.page.html',
  styleUrls: ['./detalhes-item.page.scss'],
})
export class DetalhesItemPage implements OnInit {

  numQtd = 1;
  observation="";
  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private toastCtrl: ToastController
  ) { 

  }

  @Input() public item: any;
  ngOnInit() {
  }

  async closeModal(add){
    await this.modalCtrl.dismiss(); 
    if(add){
      const toast = await this.toastCtrl.create({
          message: "Item adicionado ao seu pedido",
          duration: 2500,
          color: "secondary"
        });
        toast.present();
    }
  }
  addMore(add){
    return add ? this.numQtd++ : this.numQtd--;
  }
  async addPedido(){
    let pedidoAtual = await this.storage.get('pedido'); //resgata pedido em aberto
    let pedido = pedidoAtual ? pedidoAtual : []; //verifica se existe o pedido em aberto
    pedido.push({ // adiciona novo item
      'id' : this.item[0].id,
      'item' : this.item[0].name,
      'obs' : this.observation,
      'qtd' : this.numQtd,
      'price' : this.item[0].price
    });
    this.storage.set('pedido', pedido); //armazena no storage novo pedido
    this.closeModal(true);
  }

}
