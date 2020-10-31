import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    children: [
      { 
        path: 'todos',
        component: TodosComponent,
        resolve: {
          openDB: TodosResolver,
          databases: TodosDBResolver
        },
      },
      { 
        path: 'files',
        component: FilesComponent,
        resolve: {
          openDB: FilesResolver,
        },
      },
      { 
        path: 'account',
        component: AccountComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    FilesResolver,
    TodosDBResolver,
    TodosResolver
  ]
})
export class PrivateRoutingModule { }
