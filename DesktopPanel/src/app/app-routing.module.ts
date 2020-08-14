import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PainelComponent } from './painel/painel.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { EntregasComponent } from './entregas/entregas.component';
import { CardapioComponent } from './cardapio/cardapio.component';
import { AuthGuard } from 'src/services/auth.guard';



const routes: Routes = [
  { path: '', redirectTo: sessionStorage.getItem('path') || 'painel', pathMatch: 'full' },
  { path: 'painel', component: PainelComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'entregas', component: EntregasComponent, canActivate: [AuthGuard] },
  { path: 'cardapio', component: CardapioComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
