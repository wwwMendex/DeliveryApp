import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PainelComponent } from './painel/painel.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { EntregasComponent } from './entregas/entregas.component';
import { CardapioComponent } from './cardapio/cardapio.component';



const routes: Routes = [
  { path: '', redirectTo: 'painel', pathMatch: 'full' },
  { path: 'painel', component: PainelComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'entregas', component: EntregasComponent },
  { path: 'cardapio', component: CardapioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
