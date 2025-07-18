import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dapp/components/wallet/wallet.component').then(m => m.WalletComponent),
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./dapp/components/inicio/inicio.component').then(m => m.InicioComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'cartera',
        loadComponent: () => import('./dapp/components/cartera/cartera.component').then(m => m.CarteraComponent)
      },
      {
        path: 'enviar',
        loadComponent: () => import('./dapp/components/enviar/enviar.component').then(m => m.EnviarComponent)
      },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./dapp/components/wallet/wallet.component').then(m => m.WalletComponent),
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}