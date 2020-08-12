import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhesItemPageRoutingModule } from './detalhes-item-routing.module';

import { DetalhesItemPage } from './detalhes-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesItemPageRoutingModule
  ],
  declarations: []
})
export class DetalhesItemPageModule {}
