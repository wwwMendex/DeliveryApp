import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';

// footer module
import { FooterComponent } from './components/footer/footer.component';
import { ComponentsModule } from './components/components.module';
// Import providers
import { AuthProvider } from '../providers/auth';
import { FirebaseProvider } from '../providers/firebase';


@NgModule({
  declarations: [AppComponent,],
  entryComponents: [FooterComponent],
  imports: 
    [
      ComponentsModule,
      BrowserModule,
      BrowserAnimationsModule,
      IonicModule.forRoot(), 
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule,
      AngularFireAuthModule,
      IonicStorageModule.forRoot(),
      
    ],
  providers: 
   [
      StatusBar,
      SplashScreen,
      AuthProvider,
      FirebaseProvider,
      NativePageTransitions,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
