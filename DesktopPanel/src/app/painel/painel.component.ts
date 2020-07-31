import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { FormCupomComponent } from '../components/form-cupom/form-cupom.component';
import { MatDialog } from '@angular/material/dialog';
import { HistoricoCaixaComponent } from '../components/historico-caixa/historico-caixa.component';
import { FormPedidoComponent } from '../components/form-pedido/form-pedido.component';
import { ImpressaoService } from 'src/services/impressao.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  isOpen = JSON.parse(sessionStorage.getItem('status')) || false;
  pedidosNovos:any = [];
  caixaAberto:any = JSON.parse(localStorage.getItem('caixaAberto')) || null;
  cupons: any = JSON.parse(sessionStorage.getItem('cupons')) || [];
  pedido:any = [];
  modalCaixa = false;
  valorFundo = "";
  constructor(
    private fb: FirebaseProvider,
    private dialog: MatDialog,
    private impressaoService: ImpressaoService
  ) { 
    //setInterval(()=> this.getPedidosNovos,90000) // atualiza a cada 1 minuto e meio
  }

  async ngOnInit() {
    this.getPedidosNovos();
    this.getCupons();
    // this.getCaixaAberto();
    this.isOpen = await this.fb.getStatus().then(r => r['status']);
    sessionStorage.setItem('status', JSON.stringify(this.isOpen));
  }
  changeStatus(){
    if(this.isOpen){
      this.fb.setStatus({status: true});
      sessionStorage.setItem('status', JSON.stringify(this.isOpen));
    }else{
      this.fb.setStatus({status: false});
      sessionStorage.setItem('status', JSON.stringify(this.isOpen));
    }
  }
  async abrirCaixa(valorFundo){
    let input = valorFundo.match(/[\d\.\,]+/g);
    if(input){
      this.caixaAberto = [];
      let fundo = parseFloat(input.toString().replace(/,/g, '.'));
      this.caixaAberto['fundoCaixa'] = fundo;
      this.caixaAberto['totalCaixa'] = fundo;
      this.caixaAberto['data'] = new Date().toLocaleString(['pt-BR'], {day:'2-digit', month: '2-digit', year: '2-digit'});
      localStorage.setItem('caixaAberto', JSON.stringify(Object.assign({},this.caixaAberto)));
      this.modalCaixa = false;
    }
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

  addPedido(){
    this.dialog.open(FormPedidoComponent, {
      height: '90vh',
      width: '50vw',
      data: this.pedido
    });

  }

  confirmarPedido(){
    if(this.pedido.length > 0){
      this.fb.atualizarPedido(Object.assign({}, this.pedido[0]));
      this.imprimirPedido(this.pedido);
      alert("Pedido lançado com sucesso! Você poderá visualizar no painel 'Pedidos - Em preparo'");
      this.pedido = [];
    }
  }
  imprimirPedido(pedido){
    console.log(pedido);
    this.impressaoService.imprimir(pedido);
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
    dialogRef.afterClosed().subscribe(() => {
      sessionStorage.setItem('cupons', JSON.stringify(this.cupons));
    });
  }
}
