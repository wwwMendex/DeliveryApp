import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { summaryFileName } from '@angular/compiler/src/aot/util';
import { EnderecosPage } from '../enderecos/enderecos.page';


@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.page.html',
  styleUrls: ['./sacola.page.scss'],
})
export class SacolaPage implements OnInit {
  pagamento: any;
  troco: any;
  pedido:any = false;
  subtotal:number = 0;
  taxa_entrega:number = 5;
  total: number = 0;
  endereco: any = [];

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage,
  ) { 
    
  }
  pagamentoDin(){
    this.pagamento = "dinheiro";
    this.alertTroco("");
  }
  pagamentoCard(){
    this.pagamento = "card";
  }
  atualizarTotal(){
    this.subtotal = parseFloat(this.pedido.reduce(( prevVal, item:any ) =>
      prevVal + (item.price * item.qtd), 0 ).toFixed(2)); //duas casas decimais
    this.total = Number(this.subtotal) + Number(this.taxa_entrega);
    this.total = parseFloat(this.total.toFixed(2));
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

  async getPedido(){
    let pedidoAtual = await this.storage.get('pedido');
    return pedidoAtual ? pedidoAtual:false;
  }
  async confirmarRemover(){
    const alert = await this.alertController.create({
      header: 'Deseja remover o item?',
      buttons: [
        {
          text: 'Não!',
          handler: () => {
            return false;
          }
        }, {
          text: 'Sim!',
          handler: () => {
            return true;
          }
        }
      ]
    });

    await alert.present();
  }
  async removerItem(id:any){
    let index = this.pedido.findIndex((item:any) => {return item.id == id});
    if(this.pedido[index].qtd == 1){
      const alert = await this.alertController.create({
        header: 'Deseja remover o item?',
        buttons: [
          {
            text: 'Não!',
            role: 'cancel',
          }, {
            text: 'Sim!',
            handler: () => {
              this.pedido.splice(index, 1);
              this.atualizarTotal();
              this.storage.set('pedido', this.pedido);
            }
          }
        ]
      });
      alert.present();
    }else{
      this.pedido[index].qtd--;
      this.storage.set('pedido', this.pedido);
      this.atualizarTotal();
    }
  }
  addItem(id:any){
    let index = this.pedido.findIndex((item:any) => {return item.id == id});
    this.pedido[index].qtd++;
    this.atualizarTotal();
    this.storage.set('pedido', this.pedido);
  }

  async alertTroco(warn) {
    const alert = await this.alertController.create({
      header: 'Precisa de troco?',
      subHeader: warn,
      inputs: [
        {
          name: 'troco',
          type: 'text',
          placeholder: 'Para quanto ?'
        },
      ],
      buttons: [
        {
          text: 'Não preciso',
          handler: () => {
            console.log('não precisa');
            this.troco = 0;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            parseFloat(data.troco);
            if(data.troco > this.total){
              this.troco = parseFloat(data.troco);
            }else{
              this.alertTroco("O valor deve ser maior que o total do pedido.");
            }
          }
        }
      ]
    });
    await alert.present();
    this.troco = 0;
  }

  async confirmarPedido(){
    const alert = await this.alertController.create({
      header: 'Pedido efetuado com Sucesso',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async ngOnInit() {
    this.pedido = await this.getPedido();
    if(this.pedido){
      this.atualizarTotal();
    }
    this.endereco = await this.getEndereco();
  }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }
  async abrirEndereco(){
    const modal = await this.modalCtrl.create({
      component: EnderecosPage,
      swipeToClose: true,
    });
    modal.onDidDismiss().then(async () => this.endereco = await this.getEndereco());
    return await modal.present();
    return await modal.present();
  }

  goToHome(){
    this.router.navigateByUrl('home');
    this.closeModal();
  }

}
