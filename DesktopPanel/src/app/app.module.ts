import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PainelComponent } from './painel/painel.component';

//components
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
//firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { FirebaseProvider } from '../providers/firebase';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { EntregasComponent } from './entregas/entregas.component';
import { CardapioComponent } from './cardapio/cardapio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormCardapioComponent } from './components/form-cardapio/form-cardapio.component';
import { FormSlidesComponent } from './components/form-slides/form-slides.component';
import { FormTaxaComponent } from './components/form-taxa/form-taxa.component';
import { FormPedidoComponent } from './components/form-pedido/form-pedido.component';
import { FormCupomComponent } from './components/form-cupom/form-cupom.component';
import { HistoricoCaixaComponent } from './components/historico-caixa/historico-caixa.component';
import { PedidoEntregueComponent } from './components/pedido-entregue/pedido-entregue.component';

@NgModule({
  entryComponents: [
    FormCardapioComponent,
    FormSlidesComponent,
    FormTaxaComponent,
    FormPedidoComponent,
    FormCupomComponent,
    PedidoEntregueComponent
  ],
  declarations: [
    AppComponent,
    PainelComponent,
    MenuBarComponent,
    PedidosComponent,
    EntregasComponent,
    CardapioComponent,
    FormCardapioComponent,
    FormSlidesComponent,
    FormTaxaComponent,
    FormPedidoComponent,
    FormCupomComponent,
    HistoricoCaixaComponent,
    PedidoEntregueComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  providers: [
    FirebaseProvider,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
