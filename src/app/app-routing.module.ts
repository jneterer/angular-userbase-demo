import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { InitializationErrorComponent } from './core/initialization-error/initialization-error.component';
import { SignInComponent } from './core/sign-in/sign-in.component';
import { SignUpComponent } from './core/sign-up/sign-up.component';
import { PrivateGuard } from './shared/private.guard';
import { PublicGuard } from './shared/public.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin'
  },
  {
    path: '500',
    component: InitializationErrorComponent
  },
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [PublicGuard]
  },
  { 
    path: 'app',
    loadChildren: () => import('./private/private.module').then(m => m.PrivateModule),
    canLoad: [PrivateGuard]
  },
  {
    path: '**',
    redirectTo: 'signin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    PrivateGuard,
    PublicGuard
  ]
})
export class AppRoutingModule { }
