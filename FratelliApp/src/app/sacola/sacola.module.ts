import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SacolaPageRoutingModule } from './sacola-routing.module';

import { SacolaPage } from './sacola.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SacolaPageRoutingModule
  ],
  declarations: [SacolaPage]
})
export class SacolaPageModule {}
