import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer/footer.component';
import { SacolaPage } from '../sacola/sacola.page';
import { EnderecosPage } from '../enderecos/enderecos.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FooterComponent, SacolaPage, EnderecosPage],
  entryComponents: [SacolaPage, EnderecosPage],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [FooterComponent]
})
export class ComponentsModule { }
