import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { PedidoEntregueComponent } from '../components/pedido-entregue/pedido-entregue.component';
import { MatDialog } from '@angular/material/dialog';
import { FormTaxaComponent } from '../components/form-taxa/form-taxa.component';
import { showAlertDialog } from '../components/alert-component/alert-component.component';
import { FormEntregadoresComponent } from '../components/form-entregadores/form-entregadores.component';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.scss']
})
export class EntregasComponent implements OnInit {
  pedidosSaiuEntrega:any = JSON.parse(sessionStorage.getItem('pedidosSaiuEntrega')) || [];
  pedidosEntregues:any = [];
  modalEntregador = false;
  
  
  constructor(
    private fb: FirebaseProvider,
    private dialog: MatDialog
  ) { 
    
  }

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
  
  openFormEntregadores(){
    let dialogRef = this.dialog.open(FormEntregadoresComponent, {
      height: '50vh',
      width: '40vw',
    });
  }

  confirmarEntrega(index){
    let caixaAberto = JSON.parse(localStorage.getItem('caixaAberto'));
    if(caixaAberto){
      this.pedidosSaiuEntrega[index].status = 4;
      this.pedidosSaiuEntrega[index].horario_entrega = new Date().toLocaleString(['pt-BR'], {hour: '2-digit', minute:'2-digit'});
      this.pedidosEntregues.push(this.pedidosSaiuEntrega[index]);
      caixaAberto['pedidos'] = caixaAberto['pedidos'] ? caixaAberto['pedidos'] : [];
      caixaAberto['pedidos'].push(this.pedidosSaiuEntrega[index]);
      caixaAberto['totalCaixa']=parseFloat( (caixaAberto['totalCaixa'] + this.pedidosSaiuEntrega[index].total).toFixed(2));
      localStorage.setItem('caixaAberto', JSON.stringify(caixaAberto));
      this.fb.atualizarPedido(this.pedidosSaiuEntrega[index]);
      if(this.pedidosSaiuEntrega[index].pontos > 0){ // soma pontos do restante do pedido
        this.fb.atualizarPontos(this.pedidosSaiuEntrega[index].user_id, this.pedidosSaiuEntrega[index].pontos);
      }
      this.fb.enviarPush('Deu tudo certo!', 'Estamos confirmando a entrega do seu pedido. Obrigado e bom apetite!', this.pedidosSaiuEntrega[index].token);
      this.pedidosSaiuEntrega.splice(index, 1);
      sessionStorage.setItem('pedidosEntregues', JSON.stringify(this.pedidosEntregues));
      sessionStorage.setItem('pedidosSaiuEntrega', JSON.stringify(this.pedidosSaiuEntrega));
    }else{
      showAlertDialog({
      type: 'alert',
      title: 'Alerta',
      text: 'Você precisa abrir o caixa no painel antes de realizar esta ação',
      btnFalse: null,
      btnTrue: null,
      inputLabel: null
    }, this.dialog)
    }
  }

  modalTarifa(){
    this.dialog.open(FormTaxaComponent, {
      height: '90vh',
      width: '35vw',
    });
  }

  visualizarPedido(index){
    this.dialog.open(PedidoEntregueComponent, {
      height: '80vh',
      width: '40vw',
      data: this.pedidosEntregues[index]
    });
  }

}
