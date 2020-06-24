import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { notificationKey } from '../../environments/environment';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  pedidosPreparo:any = JSON.parse(sessionStorage.getItem('pedidosPreparo')) || [];
  pedidosNovos:any = [];
  modalEntregador = false;
  indexPedidoSaiu:any = null;
  entregadores: any = [];
  entregadoresForm = new FormGroup ({
    nome: new FormControl(),
  });
  constructor(
    private fb: FirebaseProvider,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { 
    //setInterval(()=> this.getPedidosNovos,60000) // atualiza a cada minuto
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
  }

  async getPedidosNovos(){
    this.pedidosNovos = await this.fb.getAllPedidoByStatus(1);
  }
  async getPedidosPreparo(){
    if(this.pedidosPreparo.length == 0){
      this.pedidosPreparo = await this.fb.getAllPedidoByStatus(2);
      sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
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
    this.enviarPush("Seu pedido foi confirmado!", "Está em preparo, te avisaremos quando ele sair para entrega.", this.pedidosNovos[index].token);
    pedido.status = 2;
    if(pedido.pagamento =='pontos'){
      this.fb.atualizarPontos(pedido.user_id, (-10 * pedido.qtd_pizza_pontos)); // remove 10 pontos por pizza
    }
    if(pedido.pontos > 0)
      this.fb.atualizarPontos(pedido.user_id, pedido.pontos); // soma pontos do restante do pedido
    this.imprimirPedido(pedido);
    this.fb.atualizarPedido(pedido);
    this.pedidosPreparo.push(pedido);
    this.pedidosNovos.splice(index, 1);
    sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
  }

  rejeitarPedido(pedido, index){
    this.enviarPush("Seu pedido foi rejeitado!", "O restaurante não aceitou seu pedido.", pedido.token);
    pedido.status = 5;
    this.fb.atualizarPedido(pedido);
    this.pedidosNovos.splice(index, 1);
  }

  cancelarPedido(pedido, index){
    this.enviarPush("Seu pedido foi cancelado!", "O restaurante não entregará mais seu pedido.", pedido.token);
    if(pedido.pagamento =='pontos'){
      this.fb.atualizarPontos(pedido.user_id, 10 * pedido.qtd_pizza_pontos);
    } // devolve 10 pontos por pizza
    if(pedido.pontos > 0){
      this.fb.atualizarPontos(pedido.user_id, -pedido.pontos); // remove pontos do restante do pedido
    }
    pedido.status = 5;
    this.fb.atualizarPedido(pedido);
    this.pedidosPreparo.splice(index, 1);
    sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
  }

  sairParaEntrega(){
    if(this.entregadoresForm.valid){
      this.pedidosPreparo[this.indexPedidoSaiu].status = 3;
      this.pedidosPreparo[this.indexPedidoSaiu].entregador = this.entregadoresForm.get('nome').value;
      this.enviarPush("Seu pedido está a caminho!", `${this.pedidosPreparo[this.indexPedidoSaiu].entregador} está levando até você.`, this.pedidosPreparo[this.indexPedidoSaiu].token);
      this.fb.atualizarPedido(this.pedidosPreparo[this.indexPedidoSaiu]);
      this.pedidosPreparo.splice(this.indexPedidoSaiu, 1);
      sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
      this.indexPedidoSaiu = null;
      this.modalEntregador = false;
      this.entregadoresForm.reset();
    }
  }

  enviarPush(titulo, desc, token){
    if(token){
      let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':notificationKey});
      const url = 'https://fcm.googleapis.com/fcm/send';
      const body = JSON.stringify({
        "notification":{
          "title" : titulo,
          "body" : desc,
          "icon" : "fcm_push_icon"
        },
        "to" : token,
      });
      return this.http.post(
        url, 
        body, 
        { headers: headers}
      ).subscribe(
        data => console.log(data => console.log(data))
      );
    }
  }

}
