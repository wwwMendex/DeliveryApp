import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { notificationKey } from '../../environments/environment';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  pedidosPreparo:any = JSON.parse(sessionStorage.getItem('pedidosPreparo')) || [];
  pedidosNovos:any = [];
  constructor(
    private fb: FirebaseProvider,
    private http: HttpClient
  ) { 
    //setInterval(()=> this.getPedidosNovos,60000) // atualiza a cada minuto
  }

  ngOnInit(): void {
    this.getPedidosNovos();
    this.getPedidosPreparo();
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
  confirmarPedido(index){
    this.enviarPush("Seu pedido foi confirmado!", "Está em preparo, aguarde para mais atualizações", this.pedidosNovos[index].token);
    this.pedidosNovos[index].status = 2;
    this.fb.atualizarPedido(this.pedidosNovos[index]);
    this.pedidosPreparo.push(this.pedidosNovos[index]);
    this.pedidosNovos.splice(index, 1);
    sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
  }
  sairParaEntrega(index){
    this.enviarPush("Seu pedido está a caminho!", "Fique atento ao entregador.", this.pedidosPreparo[index].token);
    this.pedidosPreparo[index].status = 3;
    this.fb.atualizarPedido(this.pedidosPreparo[index]);
    this.pedidosPreparo.splice(index, 1);
    sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
  }

  enviarPush(titulo, desc, token){
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
    console.log(url);
    console.log(body);
    console.log(headers.getAll);
    
    return this.http.post(url, body, { headers: headers}).subscribe(data => console.log(data => console.log(data)));
  }

}
