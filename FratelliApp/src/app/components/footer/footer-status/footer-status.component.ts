import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SacolaPage } from 'src/app/sacola/sacola.page';
import { ModalController } from '@ionic/angular';
import { StatusPage } from 'src/app/status/status.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-footer-status',
  templateUrl: './footer-status.component.html',
  styleUrls: ['./footer-status.component.scss'],
})
export class FooterStatusComponent implements OnInit {
  footer:any;
  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private changeDetectorRef: ChangeDetectorRef
  ) { 

  }

  async ngOnInit() {
    const pedidoEfetuado = await this.storage.get('pedidoEfetuado');
    const pedidoAberto = await this.storage.get('pedido');
    if(pedidoEfetuado && pedidoEfetuado != "" && (!pedidoAberto || pedidoAberto.length == 0)){
      this.footer = 2;
    }else{
      this.footer = 1;
    }
  }

  pedidoAberto(){
    this.footer = 1;
    this.changeDetectorRef.detectChanges();
  }

  async openSacolaModal(){
    const modal = await this.modalCtrl.create({
      component: SacolaPage,
      swipeToClose: true,
      cssClass: "modal",
    });
    return await modal.present();
  }

  async openStatus(){
    const modalStatus = await this.modalCtrl.create({
      component: StatusPage,
      swipeToClose: true,
    });
    return await modalStatus.present();
  }

}