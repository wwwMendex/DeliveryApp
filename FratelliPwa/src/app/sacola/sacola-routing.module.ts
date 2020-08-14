import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SacolaPage } from './sacola.page';

const routes: Routes = [
  {
    path: '',
    component: SacolaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SacolaPageRoutingModule {}
