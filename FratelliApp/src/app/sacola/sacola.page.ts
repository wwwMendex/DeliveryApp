import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { EnderecosPage } from '../enderecos/enderecos.page';
import { FirebaseProvider } from '../../providers/firebase';
import { StatusPage } from '../status/status.page';
import { FCM } from '@ionic-native/fcm/ngx';
import { resolve } from 'url';

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.page.html',
  styleUrls: ['./sacola.page.scss'],
})
export class SacolaPage implements OnInit {
  pagamento: any;
  troco: any = null;
  cupom:any = [];
  pedido:any = false;
  user:any = [];
  subtotal:number = 0;
  taxa_entrega:number = 0;
  total: number = 0;
  endereco: any = [];
  disabled = false;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage,
    private firebaseProvider: FirebaseProvider,
    private fcm: FCM,
    private toastCtrl: ToastController
  ){ 
      
  }
  async ngOnInit() {
    this.pedido = await this.getPedido();
    if(this.pedido){
      this.atualizarTotal();
    }
    this.endereco = await this.getEndereco();
    this.user = await this.getUsuario();
    this.getTaxaEntrega();
  }
  getTaxaEntrega(){
    this.firebaseProvider.getTarifa(this.endereco.bairro).then(r =>{
      try {
        this.taxa_entrega = r[0].valor;
      } catch (e) {
        this.taxa_entrega = null;
      }
    });
  }
  pagamentoDin(){
      this.pagamento = "dinheiro";
      this.alertTroco("");
  }
  pagamentoCard(){
    this.pagamento = "card";
  }
  pagamentoPontos(){
    if(this.user.pontos_fidelidade >=10){
      this.pagamento = "Pontos";
    }
  }
  atualizarTotal(){
    this.subtotal = parseFloat(this.pedido.reduce(( prevVal, item:any ) =>
      prevVal + (item.price * item.qtd), 0 ).toFixed(2)); //duas casas decimais
    if(this.cupom.length > 0){
      if(this.cupom[0].type == "valor"){
        this.subtotal -= parseFloat(this.cupom[0].value.toFixed(2));
      }else if(this.cupom[0].type == "porcentagem"){
        this.subtotal = parseFloat((this.subtotal * ((100 - this.cupom[0].value) / 100)).toFixed(2));
      }
    }
    this.total = Number(this.subtotal) + Number(this.taxa_entrega);
    this.total = parseFloat(this.total.toFixed(2)); 
  }

  async getUsuario(){
    let user = await this.storage.get('user');
    let userAtt = await this.firebaseProvider.getUser(user['uid']);
    return userAtt.data();
  }
  
  async getEndereco(){
    let enderecos = await this.storage.get('endereco');
    if(enderecos && enderecos.cadastrados.length > 0){
      let selecionado = enderecos.cadastrados.findIndex((end:any) => 
        {return end.id == enderecos.selecionado});
      return enderecos.cadastrados[selecionado];
    } else {
      return null;
    }
  }

  async getPedido(){
    let pedidoAtual = await this.storage.get('pedido');
    return pedidoAtual && pedidoAtual.length > 0 ? pedidoAtual:false;
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
  async inputCupom(msg){
    const alert = await this.alertController.create({
      header: 'Cupom de desconto',
      subHeader: msg[0] ? msg[0].cupom : "",
      inputs: [
        {
          name: 'cupom',
          type: 'text',
          placeholder: 'Insira aqui'
        },
      ],
      buttons: [
        {
          text: 'Remover',
          role: 'cancel',
          handler: () =>{
            this.cupom = [];
            this.atualizarTotal();
          }
        }, {
          text: 'Aplicar',
          handler: (data) => {
            let cupom = data.cupom.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if(cupom){
              this.firebaseProvider.getCupom(cupom).then(
                async (res) => {
                  if(res){
                    this.cupom = (res);
                    console.log(this.cupom)
                    const toast = await this.toastCtrl.create({
                      message: "Cupom adicionado!",
                      duration: 1000,
                      color: "secondary",
                      position: 'top'
                    });
                    toast.present();
                    this.atualizarTotal();
                  }else{
                    this.inputCupom([{cupom : "Cupom não encontrado!"}]);
                  }
                }
              );
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async validaPedido(){
    if(!this.endereco){
      this.abrirEndereco();
      return false;
    }else if(!this.pagamento){
      const toast = await this.toastCtrl.create({
        message: "Selecione a forma de pagamento!",
        duration: 1200,
        color: "danger",
        position: 'top'
      });
      toast.present();
    }else if(!this.taxa_entrega){
      const toast = await this.toastCtrl.create({
        message: "Problemas para definir a taxa de entrega, cadastre novamente seu endereço.",
        duration: 1500,
        color: "danger",
        position: 'top'
      });
      toast.present();
    }
    return (this.endereco && this.pagamento && this.taxa_entrega) ?
      true : false;
  }

  async confirmarPedido(){
    if(await this.validaPedido()){
      this.disabled = true;
      this.atualizarTotal();
      let itens = [];
      this.pedido.forEach(item => {
        let retorno = item.qtd + "x " + item.name;
        if(item.obs){
          retorno += " (obs): " + item.obs;
        }
        itens.push(retorno);
      });
      let data = new Date().toLocaleString(['pt-BR'], {day:'2-digit', month: '2-digit', year: '2-digit'});
      let horario = new Date().toLocaleString(['pt-BR'], {hour: '2-digit', minute:'2-digit'});
      let valorSemCupom:any = null;
      let cupomUtilizado = this.cupom.length > 0 ? this.cupom[0].value : "";
      if(cupomUtilizado && this.cupom[0].type == "valor"){
        valorSemCupom = parseFloat((this.subtotal + cupomUtilizado).toFixed(2));
        cupomUtilizado = "R$ " + cupomUtilizado;
      }else if(cupomUtilizado && this.cupom[0].type == "porcentagem"){
        valorSemCupom = parseFloat((this.subtotal / ((100 - cupomUtilizado)/100)).toFixed(2));
        cupomUtilizado += "%";
      }
      let token;
      try{
        token = await this.fcm.getToken();
      }catch(e){
        console.log(e);
      }
      // Organizando dados
      let pedido = {
        contato: this.user.tel,
        endereco: this.endereco.rua + ", " + this.endereco.numero + ", " + this.endereco.bairro,
        entregador: null,
        data_pedido: data,
        horario_pedido: horario ,
        horario_entrega: null,
        id: (Date.now() + Math.random()).toString().replace('.', '').substr(2,9),
        nome_usuario: this.user.name,
        pagamento: this.pagamento,
        pedido: itens,
        status: 1,
        subtotal: this.subtotal,
        cupom: cupomUtilizado,
        subtotal_sem_cupom: valorSemCupom,
        taxa_entrega: this.taxa_entrega,
        total: this.total,
        troco: this.troco,
        user_id: this.user.uid,
        token: token || null
      };
      // Subindo pedido no firestore
      this.firebaseProvider.postPedido(pedido)  
        .then(() => { 
          let pedidos = [];
          this.storage.get('pedidoEfetuado')
          .then((res)=>{
            if(res){
              res.forEach(ped => {
                pedidos.push(ped);
              });
            }
          })
          .then(() => {
            pedidos.push(pedido.id);
            this.storage.set('pedidoEfetuado', pedidos);
            if(this.pagamento == "Pontos"){
              this.user.pontos_fidelidade -=10;
              this.firebaseProvider.postUser(this.user);
              this.storage.set('user', this.user);
            }
          })
          .then(() => {
            this.storage.remove('pedido');
            this.router.navigateByUrl('home');
            this.closeModal();
            this.abrirStatus();
          });
        });
      }
      
  }


  async closeModal(){
    await this.modalCtrl.dismiss();
  }
  async abrirEndereco(){
    const modal = await this.modalCtrl.create({
      component: EnderecosPage,
      swipeToClose: true,
    });
    modal.onDidDismiss().then(async () => {
      this.endereco = await this.getEndereco();
      this.getTaxaEntrega();
    });
    return await modal.present();
  }

  async abrirStatus(){
    const modalStatus = await this.modalCtrl.create({
      component: StatusPage,
      swipeToClose: true,
    });
    return await modalStatus.present();
  }

  goToHome(){
    this.router.navigateByUrl('home');
    this.closeModal();
  }

}
