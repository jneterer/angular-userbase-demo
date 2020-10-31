import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './account/account.component';
import { FilesComponent } from './files/files.component';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { TodosComponent } from './todos/todos.component';

@NgModule({
  declarations: [
    AccountComponent,
    PrivateComponent,
    TodosComponent,
    FilesComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule
  ]
})
export class PrivateModule { }
