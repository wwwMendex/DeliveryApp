import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { isNumber, isNullOrUndefined } from 'util';

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.page.html',
  styleUrls: ['./sacola.page.scss'],
})
export class SacolaPage implements OnInit {
  pagamento: any;
  troco: any = 0;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private alertController: AlertController
  ) { 

  }
  pagamentoDin(){
    this.pagamento = "dinheiro";
    this.alertTroco();
  }
  pagamentoCard(){
    this.pagamento = "card";
  }

  async alertTroco() {
    const alert = await this.alertController.create({
      header: 'Precisa de troco?',
      inputs: [
        {
          name: 'troco',
          type: 'text',
          placeholder: 'Para quanto ?'
        },
      ],
      buttons: [
        {
          text: 'Não preciso',
          handler: () => {
            console.log('não precisa');
            this.troco = 0;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            parseFloat(data.troco);
            if(data.troco){
              this.troco = parseFloat(data.troco);
            }else{
              this.alertTroco();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
  }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }

  goToHome(){
    this.router.navigateByUrl('home');
    this.closeModal();
  }

}
