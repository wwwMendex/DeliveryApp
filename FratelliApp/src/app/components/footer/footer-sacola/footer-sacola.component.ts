import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SacolaPage } from 'src/app/sacola/sacola.page';
import { ModalController } from '@ionic/angular';
import { StatusPage } from 'src/app/status/status.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-footer-sacola',
  templateUrl: './footer-sacola.component.html',
  styleUrls: ['./footer-sacola.component.scss'],
})
export class FooterSacolaComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
    setInterval(async ()=> this.pedido = await this.getPedido(), 2000);
  }
  pedido:any = false;
  async ngOnInit() {
    this.getPedido().then((res)=>this.pedido=res);
  }

  async getPedido(){
    let pedidoAtual = await this.storage.get('pedido');
    return pedidoAtual && pedidoAtual.length > 0 ? pedidoAtual:false;
  }

  async openSacolaModal(){
    const modal = await this.modalCtrl.create({
      component: SacolaPage,
      swipeToClose: true,
      cssClass: "modal",
    });
    return await modal.present();
  }

}
