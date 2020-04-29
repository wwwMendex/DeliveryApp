import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer/footer.component';
import { SacolaPage } from '../sacola/sacola.page';



@NgModule({
  declarations: [FooterComponent, SacolaPage],
  entryComponents: [SacolaPage],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [FooterComponent]
})
export class ComponentsModule { }
