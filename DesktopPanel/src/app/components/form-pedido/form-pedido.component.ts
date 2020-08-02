import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith, throttleTime} from 'rxjs/operators';
import { showAlertDialog } from '../alert-component/alert-component.component';


export interface Item {
  name: string;
}

@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.scss']
})
export class FormPedidoComponent implements OnInit {
  clientes_cadastrados:any = JSON.parse(localStorage.getItem('clientes')) || [];
  cadastrado:boolean = false;
  // cardapio array completo
  cardapioSalgadas:any = [];
  cardapioDoces:any = [];
  cardapioBebidas:any = [];
  // lista só com nome dos itens do cardapio
  listaSalgadas: string[] = [];
  listaDoces: string[] = [];
  listaBebidas: string[] = [];
  // itens selecionados do pedido aberto
  pedidoSelect: any = [];
  // pedido com itens e informacoes
  pedidoFechado:any = [];
  // form control
  salgadaActive = new FormControl;
  doceActive = new FormControl;
  bebidaActive = new FormControl;
  obsActive = new FormControl;
  // filtros de autocomplete
  filteredOptionsSal: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;
  filteredOptionsBeb: Observable<string[]>;
  itemSelected:any = [];
  //cliente
  tel_cliente = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(8)]);
  nome_cliente = new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/[a-z\u00C0-\u00FF ]/gi)]);
  local_cliente = new FormControl('', [Validators.required]);
  end_cliente = new FormControl('', [Validators.required, Validators.minLength(5)]);
  bairro_cliente = new FormControl('', [Validators.required]);
  bairros:any = [];
  locais_cliente:any = [];
  // pagamento
  pagamento = new FormControl('', [Validators.required]);
  troco = new FormControl('', Validators.pattern(/[0-9.,]/g));

  constructor(
    private fb: FirebaseProvider,
    private dialogRef: MatDialogRef<FormPedidoComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 

  }

  ngOnInit(){
    this.getCardapio();
    this.getBairros();
    if(this.data[0]){
      this.tel_cliente.setValue(this.data[0].contato);
      this.findCliente();
      this.pagamento.setValue(this.data[0].pagamento);
      this.troco.setValue(this.data[0].troco);
    }
  }

  confirmaPedido(){
    if(this.verificaForm()){
      this.atualizarTotal();
      this.montarPedido();
      this.data[0] = this.pedidoFechado;
      this.closeDialog();
    }
  }
  verificaForm(): boolean{
    let message = null;
    if(!this.tel_cliente.valid){
      message= 'Telefone inválido!';
    }
    if(!this.nome_cliente.valid){
      message= 'Nome do cliente inválido!';
    }
    if(!this.end_cliente.valid){
      message= 'Endereço do cliente inválido!';
    }
    if(!this.bairro_cliente.valid){
      message= 'Selecione um bairro!';
    }
    if(!this.pagamento.valid){
      message= 'Selecione uma forma de pagamento!';
    }
    if(!this.bairro_cliente.valid){
      message= 'Selecione um bairro!';
    }
    if(this.pagamento.value == 'dinheiro'){
      let troco = parseFloat(this.troco.value.replace(',', '.'));
      if(!this.troco.valid || troco < this.pedidoFechado.total){
        message= 'Valor do troco inválido! O valor deve ser maior que o total do pedido!';
      }
    }
    if(this.pedidoSelect.length <= 0){
      message= 'Pedido vazio!';
    }
    if(message){
      showAlertDialog({
        type: 'alert',
        title: 'Confira',
        text: message,
        btnFalse: null,
        btnTrue: null,
        inputLabel: null
      }, this.dialog);
      return false;
    }
    return true;
  }
  async montarPedido(){
    this.salvarCliente();
    let itens = [];
    this.pedidoSelect.forEach(item => {
      let retorno:any = {
        name: item.name,
        qtd: 1,
        price: item.price
      };
      if(item.obs)
        retorno = {
          ...retorno,
          obs : item.obs
        };
      itens.push(retorno);
    });
    this.pedidoFechado['contato'] = this.tel_cliente.value;
    this.pedidoFechado['nome_usuario'] = this.nome_cliente.value;
    this.pedidoFechado['endereco'] = this.end_cliente.value + ', ' + this.bairro_cliente.value['bairro'];
    this.pedidoFechado['data_pedido'] = new Date().toLocaleString(['pt-BR'], {day:'2-digit', month: '2-digit', year: '2-digit'});
    this.pedidoFechado['horario_pedido'] = new Date().toLocaleString(['pt-BR'], {hour: '2-digit', minute:'2-digit'});
    this.pedidoFechado['horario_entrega'] = null;
    this.pedidoFechado['entregador'] = null;
    this.pedidoFechado['id'] = (Date.now() + Math.random()).toString().replace('.', '').substr(2,9);
    this.pedidoFechado['pagamento'] = this.pagamento.value;
    this.pedidoFechado['pedido'] = itens;
    this.pedidoFechado['status'] = 2;
    this.pedidoFechado['taxa_entrega'] = this.bairro_cliente.value['valor'];
    this.pedidoFechado['troco'] = this.troco.value ? parseFloat(this.troco.value.replace(',', '.')) : null;
    this.pedidoFechado['token'] = null;
      
  }
  async salvarCliente(){
    let clienteFind = await this.clientes_cadastrados.findIndex((cliente) => cliente.contato == this.tel_cliente.value);
    let cliente = {
      contato: this.tel_cliente.value,
      nome: this.nome_cliente.value,
      locais: [
        {
          local_name: this.local_cliente.value['local_name'] || this.local_cliente.value,
          endereco: this.end_cliente.value
        }
      ]
    };
    if(clienteFind>=0){
      this.clientes_cadastrados[clienteFind].locais.forEach(local => {
        if(local.local_name == cliente.locais[0].local_name){
          local.endereco = cliente.locais[0].endereco;
        }else{
          cliente.locais.push(local);
        }
      });
      this.clientes_cadastrados[clienteFind] = cliente;      
    }else{
      this.clientes_cadastrados.push(cliente);
    }
    localStorage.setItem('clientes', JSON.stringify(this.clientes_cadastrados));
  }
  findCliente(){
    this.cadastrado = false;
    let match = this.clientes_cadastrados.find((cliente) => cliente.contato == this.tel_cliente.value);
    
    if(match){
      this.nome_cliente.setValue(match.nome);
      this.locais_cliente = match.locais;
      this.cadastrado = true;
    }
  }
  setEnderecoCliente(){
    if(this.local_cliente.value == 'new'){
      this.cadastrado = false;
      this.end_cliente.setValue('');
      this.local_cliente.setValue('');
    }else{
      this.end_cliente.setValue(this.local_cliente.value['endereco']);
    }
  }

  async getBairros(){
    this.bairros = await this.fb.getTarifas();
    // ordena alfabeticamente
    this.bairros.sort((a, b) => 
      (a.bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
      b.bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) 
      ? 1 
      : ((b.bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
      a.bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) 
      ? -1 
      : 0)
    ); 
  }

  async getCardapio() {
    let cardapio = await this.fb.getCardapio();
    this.listarSalgadas(cardapio[0]);
    this.listarDoces(cardapio[1]);
    this.listarBebidas(cardapio[2]);
  }
  addItem(array){    
    let item = JSON.parse(JSON.stringify(array));
    item['obs'] = this.obsActive.value ? this.obsActive.value : null;
    this.pedidoSelect.push(item);
    this.atualizarSubtotal(item['price']);
    this.salgadaActive.setValue('');
    this.doceActive.setValue('');
    this.bebidaActive.setValue('');
    this.itemSelected = [];
  }
  atualizarSubtotal(valor){
    this.pedidoFechado['subtotal'] = this.pedidoFechado['subtotal'] ? this.pedidoFechado['subtotal'] : 0;
    this.pedidoFechado['subtotal'] = parseFloat((this.pedidoFechado['subtotal'] + valor).toFixed(2));
    this.atualizarTotal();
  }
  atualizarTotal(){
    this.pedidoFechado['taxa_entrega'] = this.pedidoFechado['taxa_entrega'] ? this.pedidoFechado['taxa_entrega'] : 0;
    this.pedidoFechado['total'] = parseFloat((this.pedidoFechado['taxa_entrega'] + this.pedidoFechado['subtotal']).toFixed(2));
  }
  addTaxa(){
    this.pedidoFechado['taxa_entrega'] = this.bairro_cliente.value['valor'];
    this.atualizarTotal();
  }
  async removeItem(index){
    if(await showAlertDialog({
      type: 'confirm',
      title: 'Confirme',
      text: 'Realmente deseja remover o item do pedido?',
      btnFalse: 'Voltar',
      btnTrue: 'Sim!',
      inputLabel: null
    }, this.dialog)){
      this.atualizarSubtotal(-this.pedidoSelect[index].price);
      this.pedidoSelect.splice(index, 1);
    }
  }
  async findItem(active, cardapio, type){
    this.itemSelected = [];
    this.obsActive.setValue('');
    let input = active.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let match:any = null;
    for (let item of cardapio){
      match = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") == input
        ? item
        : match;
    }
    this.itemSelected[type] = match? match : null;
  }

  async listarSalgadas(cardapio: any){
    this.cardapioSalgadas = cardapio;
    cardapio.forEach(item => this.listaSalgadas.push(item.name));
    this.filteredOptionsSal = this.salgadaActive.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.listaSalgadas))
    );
  }

  async listarDoces(cardapio: any){
    this.cardapioDoces = cardapio;
    cardapio.forEach(item => this.listaDoces.push(item.name));
    this.filteredOptionsDoc = this.doceActive.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.listaDoces))
    );
  }

  async listarBebidas(cardapio: any){
    this.cardapioBebidas = cardapio;
    cardapio.forEach(item => this.listaBebidas.push(item.name));
    this.filteredOptionsBeb = this.bebidaActive.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.listaBebidas))
    );
  }
  private _filter(value: string, lista): string[] {
    const filterValue = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return lista.filter(option => option.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(filterValue));
  }
  
  closeDialog() {
    this.dialogRef.close();
  }

}
