import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnderecosPage } from './enderecos.page';

const routes: Routes = [
  {
    path: '',
    component: EnderecosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnderecosPageRoutingModule {}
