import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterSacolaComponent } from './footer/footer-sacola/footer-sacola.component';
import { FooterStatusComponent } from './footer/footer-status/footer-status.component';
import { SacolaPage } from '../sacola/sacola.page';
import { EnderecosPage } from '../enderecos/enderecos.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusPage } from '../status/status.page';



@NgModule({
  declarations: [FooterSacolaComponent,FooterStatusComponent , SacolaPage, EnderecosPage, StatusPage],
  entryComponents: [SacolaPage, EnderecosPage, StatusPage],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [FooterSacolaComponent, FooterStatusComponent]
})
export class ComponentsModule { }
