import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ImpressaoService } from 'src/services/impressao.service';
import { showAlertDialog } from '../components/alert-component/alert-component.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  pedidosPreparo:any = [];
  pedidosNovos:any = [];
  modalEntregador = false;
  indexPedidoSaiu:any = null;
  entregadores: any = [];
  entregadoresForm = new FormGroup ({
    nome: new FormControl(),
  });
  constructor(
    private fb: FirebaseProvider,
    private formBuilder: FormBuilder,
    private impressaoService: ImpressaoService,
    private dialog: MatDialog
  ) { 
 
    this.entregadoresForm = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPedidosNovos();
    this.getPedidosPreparo();
  }

  imprimirPedido(pedido){
    console.log(pedido);
    this.impressaoService.imprimir(pedido);
  }

  async getPedidosNovos(){
    console.log('procurando');
    this.pedidosNovos = await this.fb.getAllPedidoByStatus(1);
  }
  async getPedidosPreparo(){
    if(this.pedidosPreparo.length == 0){
      this.pedidosPreparo = await this.fb.getAllPedidoByStatus(2);
    }
  }
  confirmarEntregador(index){
    this.modalEntregador = true;
    this.indexPedidoSaiu = index;
    this.entregadores = JSON.parse(localStorage.getItem('entregadores')) || [];
    this.entregadoresForm.reset();
  }

  closeModal(){
    this.modalEntregador = false;
    this.indexPedidoSaiu = null;
    this.entregadoresForm.reset();
  }
  
  confirmarPedido(pedido, index){
    this.fb.enviarPush("Seu pedido foi confirmado!", "Está em preparo, te avisaremos quando ele sair para entrega.", this.pedidosNovos[index].token);
    pedido.status = 2;
    if(pedido.pagamento =='pontos'){
      this.fb.atualizarPontos(pedido.user_id, (-10 * pedido.qtd_pizza_pontos)); // remove 10 pontos por pizza
    }
    // if(pedido.pontos > 0)
    //   this.fb.atualizarPontos(pedido.user_id, pedido.pontos); // soma pontos do restante do pedido
    this.imprimirPedido(pedido);
    this.fb.atualizarPedido(pedido);
    this.pedidosPreparo.push(pedido);
    this.pedidosNovos.splice(index, 1);
  }

  async rejeitarPedido(pedido, index){
    if(await showAlertDialog({
      type: 'confirm',
      title: 'Confirme',
      text: 'Deseja rejeitar o pedido?',
      btnFalse: 'Voltar',
      btnTrue: 'Sim!',
      inputLabel: null
    }, this.dialog)){
      this.fb.enviarPush("Seu pedido foi rejeitado!", "O restaurante não aceitou seu pedido.", pedido.token);
      pedido.status = 5;
      this.fb.atualizarPedido(pedido);
      this.pedidosNovos.splice(index, 1);
    }
  }

  async cancelarPedido(pedido, index){
    if(await showAlertDialog({
      type: 'confirm',
      title: 'Confirme',
      text: 'Deseja cancelar o pedido?',
      btnFalse: 'Voltar',
      btnTrue: 'Sim!',
      inputLabel: null
    }, this.dialog)){
      this.fb.enviarPush("Seu pedido foi cancelado!", "O restaurante não entregará mais seu pedido.", pedido.token);
      if(pedido.pagamento =='pontos'){
        this.fb.atualizarPontos(pedido.user_id, 10 * pedido.qtd_pizza_pontos);
      } // devolve 10 pontos por pizza
      // if(pedido.pontos > 0){
      //   this.fb.atualizarPontos(pedido.user_id, -pedido.pontos); // remove pontos do restante do pedido
      // }
      pedido.status = 5;
      this.fb.atualizarPedido(pedido);
      this.pedidosPreparo.splice(index, 1);
    }
  }

  sairParaEntrega(){
    if(this.entregadoresForm.valid){
      this.pedidosPreparo[this.indexPedidoSaiu].status = 3;
      this.pedidosPreparo[this.indexPedidoSaiu].entregador = this.entregadoresForm.get('nome').value;
      this.fb.enviarPush("Seu pedido está a caminho!", `${this.pedidosPreparo[this.indexPedidoSaiu].entregador} está levando até você.`, this.pedidosPreparo[this.indexPedidoSaiu].token);
      this.fb.atualizarPedido(this.pedidosPreparo[this.indexPedidoSaiu]);
      this.pedidosPreparo.splice(this.indexPedidoSaiu, 1);
      this.indexPedidoSaiu = null;
      this.modalEntregador = false;
      this.entregadoresForm.reset();
    }
  }

}
