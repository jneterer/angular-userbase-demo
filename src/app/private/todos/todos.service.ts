import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import userbase from 'userbase-js';
import { environment } from '../../../environments/environment';
import { ISharedTodoDb, ITodo } from '../../contracts/itodos';
import { IError, IItem } from '../../contracts/iuserbase';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private todos: BehaviorSubject<IItem<ITodo>[]> = new BehaviorSubject<IItem<ITodo>[]>([]);
  public todos$: Observable<IItem<ITodo>[]> = this.todos.asObservable();
  private getTodosError: BehaviorSubject<IError> = new BehaviorSubject<IError>(null);
  public getTodosError$: Observable<IError> = this.getTodosError.asObservable();
  private sharedTodos: BehaviorSubject<ISharedTodoDb[]> = new BehaviorSubject<ISharedTodoDb[]>([]);
  public sharedTodos$: Observable<ISharedTodoDb[]> = this.sharedTodos.asObservable();
  private getSharedTodosError: BehaviorSubject<IError> = new BehaviorSubject<IError>(null);
  public getSharedTodosError$: Observable<IError> = this.getTodosError.asObservable();

  constructor() { }

  /**
   * Gets the list of TODOs for the user.
   * @returns {Observable<void>}
   */
  getTodos(): Observable<void> {
    return from(userbase.openDatabase({
      databaseName: environment.TODOS_DB,
      changeHandler: (todos: IItem<ITodo>[]) => {
        this.todos.next(todos);
      }
    })).pipe(
      catchError((error: IError) => {
        this.getTodosError.next(error);
        return throwError(error);
      })
    );
  }

  /**
   * Gets the list of shared TODOs for the user.
   * @param {string} databaseId
   * @param {string} username
   * @returns {Observable<void>}
   */
  getSharedTodos(databaseId: string, username: string): Observable<void> {
    return from(userbase.openDatabase({
      databaseId: databaseId,
      changeHandler: (todos: IItem<ITodo>[]) => {
        let dbIndex: number = null;
        let sharedTodoDbs = this.sharedTodos.value.slice();
        const existsInArray: boolean = sharedTodoDbs.some((sharedTodoDb: ISharedTodoDb, index: number) => {
          if (sharedTodoDb.databaseId === databaseId) {
            dbIndex = index;
            return true;
          }
          return false;
        });
        if (existsInArray) {
          sharedTodoDbs[dbIndex].db = todos;
        } else {
          sharedTodoDbs.push({
            databaseId,
            username,
            db: todos
          });
        }
        this.sharedTodos.next(sharedTodoDbs);
      }
    })).pipe(
      catchError((error: IError) => {
        this.getSharedTodosError.next(error);
        return throwError(error);
      })
    );
  }

  /**
   * Creates a TODO.
   * @param {ITodo} todo 
   * @returns {Observable<void>}
   */
  createTodo(todo: ITodo): Observable<void> {
    return from(userbase.insertItem({
      databaseName: environment.TODOS_DB,
      item: todo
    }));
  }

  /**
   * Deletes a TODO.
   * @param {string} itemId
   * @returns {Observable<void>}
   */
  deleteTodo(itemId: string): Observable<void> {
    return from (userbase.deleteItem({
      databaseName: environment.TODOS_DB,
      itemId: itemId
    }));
  }

  /**
   * Updates a TODO.
   * @param {string} itemId 
   * @param {ITodo} item 
   * @returns {Observable<void>}
   */
  updateTodo(itemId: string, item: ITodo): Observable<void> {
    return from (userbase.updateItem({
      databaseName: environment.TODOS_DB,
      item: item,
      itemId: itemId
    }));
  }

}
