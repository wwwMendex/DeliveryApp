import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import { FormCupomComponent } from '../components/form-cupom/form-cupom.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  isOpen = true;
  pedidosNovos:any = [];
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
      this.cupons = await this.fb.getCupons();
      sessionStorage.setItem('cupons', JSON.stringify(this.cupons));
    });
  }

}
