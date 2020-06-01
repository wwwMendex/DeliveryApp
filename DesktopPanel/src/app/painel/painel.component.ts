import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  isOpen = true;
  pedidosNovos:any = [];
  constructor(
    private fb: FirebaseProvider
  ) { 
    //setInterval(()=> this.getPedidosNovos,90000) // atualiza a cada 1 minuto e meio
  }

  ngOnInit(): void {
    this.getPedidosNovos();
  }
  
  async getPedidosNovos(){
    this.pedidosNovos = await this.fb.getAllPedidoByStatus(1);
  }

}
