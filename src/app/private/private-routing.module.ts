import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { PrivateComponent } from './private.component';

const routes: Routes = [
  {
    path: '', 
    component: PrivateComponent,
    children: [
      { 
        path: 'account',
        component: AccountComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
