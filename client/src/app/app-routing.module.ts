import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NeedToApproveComponent } from './components/pages/need-to-approve/need-to-approve.component';
import { LoggedGuard } from './services/guards/login/logged-guard.service';
import { LoginGuardService } from './services/guards/login/login-guard.service';
import { SuperadminComponent } from './components/superadmin/superadmin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [LoggedGuard],
    loadChildren: () =>
      import('./components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'home',
    canActivate: [LoginGuardService],
    component: HomeComponent,
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'superadmin',
    canActivate: [LoginGuardService],
    component: SuperadminComponent,
    loadChildren: () =>
      import('./components/superadmin/superadmin.module').then(
        (m) => m.SuperadminModule
      ),
  },
  {
    path: 'page',
    loadChildren: () =>
      import('./components/pages/pages.module').then((m) => m.PagesModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
