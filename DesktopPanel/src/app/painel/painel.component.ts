import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { FormCupomComponent } from '../components/form-cupom/form-cupom.component';
import { MatDialog } from '@angular/material/dialog';
import { HistoricoCaixaComponent } from '../components/historico-caixa/historico-caixa.component';
import { FormPedidoComponent } from '../components/form-pedido/form-pedido.component';
import { ImpressaoService } from 'src/services/impressao.service';
import { showAlertDialog } from '../components/alert-component/alert-component.component';

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
  notification: HTMLAudioElement = new Audio();
  
  constructor(
    private fb: FirebaseProvider,
    private dialog: MatDialog,
    private impressaoService: ImpressaoService
  ) {
    this.notification.src = "file:///src/assets/sounds/notification.mp3";
    this.notification.load();
  }

  async ngOnInit() {
    setInterval(()=> this.getPedidosNovos() ,90000); // atualiza a cada 1 minuto e meio
    this.getPedidosNovos();
    this.getCupons();
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
  async abrirCaixa(){
    let valorCaixa = showAlertDialog({
      type: 'prompt',
      title: 'Abrir o caixa',
      text: 'Insira o valor do fundo do caixa',
      btnFalse: 'Voltar',
      btnTrue: 'Abrir!',
      inputLabel: 'R$:'
    }, this.dialog).then(res => res ? res.toString().match(/[\d\.\,]+/g) : null);
    let input = await valorCaixa;
    if(input){
      this.caixaAberto = [];
      let fundo = parseFloat(input.toString().replace(/,/g, '.'));
      this.caixaAberto['fundoCaixa'] = fundo;
      this.caixaAberto['totalCaixa'] = fundo;
      this.caixaAberto['data'] = new Date().toLocaleString(['pt-BR'], {day:'2-digit', month: '2-digit', year: '2-digit'});
      localStorage.setItem('caixaAberto', JSON.stringify(Object.assign({},this.caixaAberto)));
    }
  }
  async fecharCaixa(){
    if(await showAlertDialog({
      type: 'confirm',
      title: 'Confirme',
      text: 'Deseja fechar o caixa?',
      btnFalse: 'Voltar',
      btnTrue: 'Sim!',
      inputLabel: null
    }, this.dialog)){
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
      showAlertDialog({
        type: 'alert',
        title: 'Pedido lançado!',
        text: "Você poderá visualiza-lo no painel 'Pedidos - Em preparo'",
        btnFalse: null,
        btnTrue: null,
        inputLabel: null
      }, this.dialog)
      this.pedido = [];
    }
  }
  imprimirPedido(pedido){
    this.impressaoService.imprimir(pedido);
  }


  async getPedidosNovos(){
    console.log('atualizando');
    this.fb.getAllPedidoByStatus(1)
    .then((res => {
      if((res as any).length){
        this.pedidosNovos = res;
        console.log('pedidos novos');
        this.notification.play().catch(e => console.log('erro ' + e));
      }else{
        return false;
      }
    }));
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
