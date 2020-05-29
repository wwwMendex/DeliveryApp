import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.scss']
})
export class EntregasComponent implements OnInit {
  pedidosSaiuEntrega:any = JSON.parse(sessionStorage.getItem('pedidosSaiuEntrega')) || [];
  pedidosEntregues:any = [];

  constructor(
    private fb: FirebaseProvider
  ) { }

  ngOnInit(): void {
    this.getPedidosSaiuEntrega();
    this.getPedidosEntregues();
  }

  async getPedidosSaiuEntrega(){
    this.pedidosSaiuEntrega = await this.fb.getAllPedidoByStatus(3);
    sessionStorage.setItem('pedidosSaiuEntrega', JSON.stringify(this.pedidosSaiuEntrega));
  }
  async getPedidosEntregues(){
    this.pedidosEntregues = JSON.parse(sessionStorage.getItem('pedidosEntregues')) || [];
  }

  confirmarEntrega(index){
    this.pedidosSaiuEntrega[index].status = 4;
    this.pedidosSaiuEntrega[index].horario_entrega = new Date().toLocaleString(['pt-BR'], {hour: '2-digit', minute:'2-digit'});
    this.pedidosEntregues.push(this.pedidosSaiuEntrega[index]);
    this.fb.atualizarPedido(this.pedidosSaiuEntrega[index]);
    this.pedidosSaiuEntrega.splice(index, 1);
    sessionStorage.setItem('pedidosEntregues', JSON.stringify(this.pedidosEntregues));
    sessionStorage.setItem('pedidosSaiuEntrega', JSON.stringify(this.pedidosSaiuEntrega));
  }

}
