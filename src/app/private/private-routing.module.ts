import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateGuard } from '../shared/private.guard';
import { AccountComponent } from './account/account.component';
import { FilesComponent } from './files/files.component';
import { FilesResolver } from './files/files.resolver.service';
import { PrivateComponent } from './private.component';
import { TodosDBResolver } from './todos/todos-db.resolver.service';
import { TodosComponent } from './todos/todos.component';
import { TodosResolver } from './todos/todos.resolver.service';

const routes: Routes = [
  {
    path: '', 
    component: PrivateComponent,
    canActivate: [PrivateGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/app/todos'
      },
      { 
        path: 'todos',
        component: TodosComponent,
        canActivate: [PrivateGuard],
        resolve: {
          openDB: TodosResolver,
          databases: TodosDBResolver
        },
      },
      { 
        path: 'files',
        component: FilesComponent,
        canActivate: [PrivateGuard],
        resolve: {
          openDB: FilesResolver,
        },
      },
      { 
        path: 'account',
        component: AccountComponent,
        canActivate: [PrivateGuard]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    FilesResolver,
    PrivateGuard,
    TodosDBResolver,
    TodosResolver
  ]
})
export class PrivateRoutingModule { }
