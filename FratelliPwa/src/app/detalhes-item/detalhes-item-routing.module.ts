import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesItemPage } from './detalhes-item.page';

const routes: Routes = [
  {
    path: '',
    component: DetalhesItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesItemPageRoutingModule {}
