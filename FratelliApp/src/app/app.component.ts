import { Component } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseProvider } from 'src/providers/firebase';
import { FCM } from '@ionic-native/fcm/ngx';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fb: FirebaseProvider,
    private alert: AlertController,
    private fcm: FCM,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.verificaStatus();
      this.subscribePush();
    });

    
  }

  subscribePush(){
    this.fcm.onNotification().subscribe(data =>{  
      this.toastCtrl.create({
        message: 'O status do seu pedido foi atualizado!',
        duration: 2000,
        position: "bottom",
        color: "danger"
      }).then((toast) => toast.present());
    });
  }

  verificaStatus(){
    console.log('chegou aq');
    this.fb.getStatus()
      .then(async r => {
        if(!r['status']){
          const alert = await this.alert.create({
            header: 'O estabelecimento está fechado.',
            subHeader: "No momento não é possível fazer novos pedidos pelo aplicativo!",
            buttons: [
              {
                text: 'Okay',
                role: 'cancel'
              }
            ]
          });
          alert.present();
        }
      });
  }
}
