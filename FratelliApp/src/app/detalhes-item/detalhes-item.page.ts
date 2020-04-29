import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalhes-item',
  templateUrl: './detalhes-item.page.html',
  styleUrls: ['./detalhes-item.page.scss'],
})
export class DetalhesItemPage implements OnInit {

  
  constructor(
    private modalCtrl: ModalController,
  ) { }
  @Input() public item: any;
  ngOnInit() {
  }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }

}
