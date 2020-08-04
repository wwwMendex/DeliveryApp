import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseProvider } from 'src/providers/firebase';



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
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.verificaStatus();
    });

    
  }

  
  verificaStatus(){
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
