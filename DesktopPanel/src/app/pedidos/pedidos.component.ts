import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';

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
    this.pedidosNovos[index].status = 2;
    this.fb.atualizarPedido(this.pedidosNovos[index]);
    this.pedidosPreparo.push(this.pedidosNovos[index]);
    this.pedidosNovos.splice(index, 1);
    sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
  }
  sairParaEntrega(index){
    this.pedidosPreparo[index].status = 3;
    this.fb.atualizarPedido(this.pedidosPreparo[index]);
    this.pedidosPreparo.splice(index, 1);
    sessionStorage.setItem('pedidosPreparo', JSON.stringify(this.pedidosPreparo));
  }

}
