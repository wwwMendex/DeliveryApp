import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadChildren: () => import('./autentication/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'auth/cadastro',
    loadChildren: () => import('./autentication/cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
