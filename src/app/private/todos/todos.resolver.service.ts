import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TodosService } from '../todos/todos.service';

@Injectable({ 
  providedIn: 'root' 
})
export class TodosResolver implements Resolve<void> {

  constructor(private todoService: TodosService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return this.todoService.getTodos();
  }
}