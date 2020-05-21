import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PainelComponent } from './painel/painel.component';

//components
import {MatToolbarModule} from '@angular/material/toolbar';

//firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { FirebaseProvider } from '../providers/firebase';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { EntregasComponent } from './entregas/entregas.component';
import { CardapioComponent } from './cardapio/cardapio.component';

@NgModule({
  declarations: [
    AppComponent,
    PainelComponent,
    MenuBarComponent,
    PedidosComponent,
    EntregasComponent,
    CardapioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatToolbarModule
  ],
  providers: [
    FirebaseProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
