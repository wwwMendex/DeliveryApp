import { Component, OnInit } from '@angular/core';
import { SacolaPage } from 'src/app/sacola/sacola.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  async openSacolaModal(){
    const modal = await this.modalCtrl.create({component: SacolaPage});
    return await modal.present();
  }

}
