import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-historico-caixa',
  templateUrl: './historico-caixa.component.html',
  styleUrls: ['./historico-caixa.component.scss']
})
export class HistoricoCaixaComponent implements OnInit {
  historico:any = [];
  selecionado:any =false;
  pedidoSelecionado:any = false;
  index: number;
  constructor(
    public dialogRef: MatDialogRef<HistoricoCaixaComponent>,
  ) { }

  ngOnInit(): void {
    this.historico = JSON.parse(localStorage.getItem('historicoCaixa'));
    this.limparHistorico();
  }
  limparHistorico(){
    if(this.historico.length > 40){
      let rem = this.historico.length - 40;
      this.historico.splice(0, rem);
      localStorage.setItem('historicoCaixa', JSON.stringify(this.historico));
    }
  }
  selecionaData(event){
    this.index = parseInt(event.value);
    this.selecionado = true;
    this.pedidoSelecionado = false;
  }
  detalhesPedido(pedido){
    this.pedidoSelecionado = pedido;
    
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
