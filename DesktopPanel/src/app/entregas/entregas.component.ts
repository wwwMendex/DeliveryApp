import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.scss']
})
export class EntregasComponent implements OnInit {
  pedidosSaiuEntrega:any = JSON.parse(sessionStorage.getItem('pedidosSaiuEntrega')) || [];
  pedidosEntregues:any = [];
  modalEntregador = false;
  entregadores:any = JSON.parse(localStorage.getItem('entregadores')) || [];
  entregadoresForm = new FormGroup ({
    nome: new FormControl(),
  });
  constructor(
    private fb: FirebaseProvider,
    private formBuilder: FormBuilder
  ) { 
    this.entregadoresForm = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPedidosSaiuEntrega();
    this.getPedidosEntregues();
  }
  closeModal(){
    this.modalEntregador = false;
  }
  cadastrarEntregador(){
    if(this.entregadoresForm.valid){
      this.entregadores.push(this.entregadoresForm.value);
      localStorage.setItem('entregadores', JSON.stringify(this.entregadores));
      this.entregadoresForm.reset();
    }
  }
  removerEntregador(index){
    if(confirm("Você deseja remover o entregador?")){
      this.entregadores.splice(index, 1);
      localStorage.setItem('entregadores', JSON.stringify(this.entregadores));
    }
  }
  async getPedidosSaiuEntrega(){
    this.pedidosSaiuEntrega = await this.fb.getAllPedidoByStatus(3);
    sessionStorage.setItem('pedidosSaiuEntrega', JSON.stringify(this.pedidosSaiuEntrega));
  }
  async getPedidosEntregues(){
    this.pedidosEntregues = JSON.parse(sessionStorage.getItem('pedidosEntregues')) || [];
  }

  confirmarEntrega(index){
    let caixaAberto = JSON.parse(localStorage.getItem('caixaAberto'));
    if(caixaAberto){
      this.pedidosSaiuEntrega[index].status = 4;
      this.pedidosSaiuEntrega[index].horario_entrega = new Date().toLocaleString(['pt-BR'], {hour: '2-digit', minute:'2-digit'});
      this.pedidosEntregues.push(this.pedidosSaiuEntrega[index]);
      caixaAberto['pedidos'] = caixaAberto['pedidos'] ? caixaAberto['pedidos'] : [];
      caixaAberto['pedidos'].push(this.pedidosSaiuEntrega[index]);
      caixaAberto['totalCaixa']+=parseFloat((this.pedidosSaiuEntrega[index].total).toFixed(2));
      localStorage.setItem('caixaAberto', JSON.stringify(caixaAberto));
      this.fb.atualizarPedido(this.pedidosSaiuEntrega[index]);
      this.pedidosSaiuEntrega.splice(index, 1);
      sessionStorage.setItem('pedidosEntregues', JSON.stringify(this.pedidosEntregues));
      sessionStorage.setItem('pedidosSaiuEntrega', JSON.stringify(this.pedidosSaiuEntrega));
    }else{
      alert("Você deve abrir o caixa no painel antes!");
    }
  }

}
