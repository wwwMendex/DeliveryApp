import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardapioPageRoutingModule } from './cardapio-routing.module';

import { CardapioPage } from './cardapio.page';
import { ComponentsModule } from '../components/components.module';
import { DetalhesItemPage } from '../detalhes-item/detalhes-item.page';
import { EnderecosPage } from '../enderecos/enderecos.page';

@NgModule({
  entryComponents:[DetalhesItemPage],
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    CardapioPageRoutingModule
  ],
  declarations: [CardapioPage, DetalhesItemPage]
})
export class CardapioPageModule {}
