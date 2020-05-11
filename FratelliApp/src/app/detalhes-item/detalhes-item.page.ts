import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FirebaseProvider } from 'src/providers/firebase';

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
    private toastCtrl: ToastController,
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
          duration: 1200,
          color: "secondary",
          position: 'top'
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
    let index = pedido.findIndex((item:any) => {return item.id == this.item[0].id}); 
    if(index>-1){ // verifica se já tem o item no pedido
      pedido[index].qtd+= this.numQtd;
      this.storage.set('pedido', pedido);
    }else{ // se não tiver
      pedido.push({ // adiciona novo item
        'id' : this.item[0].id,
        'name' : this.item[0].name,
        'obs' : this.observation,
        'qtd' : this.numQtd,
        'price' : this.item[0].price,
        'type' : this.item[0].type
      });
      this.storage.set('pedido', pedido); //armazena no storage novo pedido
    }
    this.closeModal(true);
  }

}
