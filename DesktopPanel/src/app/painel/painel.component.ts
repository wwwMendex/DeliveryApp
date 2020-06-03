import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { FormCupomComponent } from '../components/form-cupom/form-cupom.component';
import { MatDialog } from '@angular/material/dialog';
import { HistoricoCaixaComponent } from '../components/historico-caixa/historico-caixa.component';
@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  isOpen = true;
  pedidosNovos:any = [];
  caixaAberto:any = JSON.parse(localStorage.getItem('caixaAberto')) || null;
  cupons: any = JSON.parse(sessionStorage.getItem('cupons')) || [];
  constructor(
    private fb: FirebaseProvider,
    private dialog: MatDialog
  ) { 
    //setInterval(()=> this.getPedidosNovos,90000) // atualiza a cada 1 minuto e meio
  }

  ngOnInit(): void {
    this.getPedidosNovos();
    this.getCupons();
    // this.getCaixaAberto();
  }
  async abrirCaixa(){
    this.caixaAberto = [];
    let fundo = parseFloat(prompt("Insira o valor do fundo do caixa").replace(/,/g, '.')); 
    this.caixaAberto['fundoCaixa'] = fundo;
    this.caixaAberto['totalCaixa'] = fundo;
    this.caixaAberto['data'] = new Date().toLocaleString(['pt-BR'], {day:'2-digit', month: '2-digit', year: '2-digit'});
    localStorage.setItem('caixaAberto', JSON.stringify(Object.assign({},this.caixaAberto)));
  }
  fecharCaixa(){
    if(confirm("Deseja fechar o caixa?")){
      let historicoCaixa = JSON.parse(localStorage.getItem('historicoCaixa')) || [];
      let caixaAberto = JSON.parse(localStorage.getItem('caixaAberto'));
      historicoCaixa.push(caixaAberto);
      localStorage.setItem('historicoCaixa', JSON.stringify(historicoCaixa));
      this.caixaAberto = null;
      localStorage.removeItem('caixaAberto');
    }
  }
  abrirHistorico(){
    this.dialog.open(HistoricoCaixaComponent, {
      height: '80vh',
      width: '40vw',
    });
  }
  async getPedidosNovos(){
    this.pedidosNovos = await this.fb.getAllPedidoByStatus(1);
  }
  async getCupons(){
    if(this.cupons.length == 0){
      this.cupons = await this.fb.getCupons();
      sessionStorage.setItem('cupons', JSON.stringify(this.cupons));
    }
  }
  abrirCupom(){
    let dialogRef = this.dialog.open(FormCupomComponent, {
      height: '80vh',
      width: '40vw',
      data: this.cupons
    });
    dialogRef.afterClosed().subscribe(async result => {
      sessionStorage.setItem('cupons', JSON.stringify(this.cupons));
    });
  }

}
