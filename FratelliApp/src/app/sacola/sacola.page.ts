import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.page.html',
  styleUrls: ['./sacola.page.scss'],
})
export class SacolaPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { 

  }

  ngOnInit() {
  }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }

}
