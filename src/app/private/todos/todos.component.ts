import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Database, DatabaseUsers } from 'userbase-js';
import { environment } from '../../../environments/environment';
import { ISharedTodoDb, ITodo } from '../../contracts/itodos';
import { IError, IItem } from '../../contracts/iuserbase';
import { DatabaseService } from '../shared/database.service';
import { TodosService } from './todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  private unsubscribe: Subject<any> = new Subject<any>();
  todos: IItem<ITodo>[];
  getTodosError: string;
  todoName: string = ''
  updateTodoError: string;
  createTodoError: string;
  sharedWith: DatabaseUsers[] = [];
  revokeAccessError: string;
  getSharedTodosError: string;
  username: string = '';
  shareTodosError: string;
  sharedWithMe: ISharedTodoDb[] = [];

  constructor(private route: ActivatedRoute,
              private cd: ChangeDetectorRef,
              private todoService: TodosService,
              private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntil(this.unsubscribe),
      mergeMap(({ databases }: { databases: Database[] }) => {
        const sharedWithMe: Database[] = databases?.filter((database: Database) => {
          return Object.keys(database).includes('databaseId') && !database.isOwner;
        });
        this.sharedWith = databases?.find((database: Database) => database.databaseName === 'todos' && database.isOwner).users;
        console.log('shared with: ', this.sharedWith);
        return forkJoin(
          sharedWithMe.map((database: Database) => this.todoService.getSharedTodos(database.databaseId, database.receivedFromUsername))
        )
      })
    ).subscribe();
    this.todoService.todos$.pipe(takeUntil(this.unsubscribe))
    .subscribe((todos: IItem<ITodo>[]) => this.todos = todos);
    this.todoService.sharedTodos$.pipe(takeUntil(this.unsubscribe))
    .subscribe((sharedWithMe: ISharedTodoDb[]) => {
      this.sharedWithMe = sharedWithMe;
      this.cd.detectChanges();
    });
    this.todoService.getTodosError$.pipe(takeUntil(this.unsubscribe))
    .subscribe((error: IError) => this.getTodosError = error?.message);
    this.todoService.getSharedTodosError$.pipe(takeUntil(this.unsubscribe))
    .subscribe((error: IError) => this.getSharedTodosError = error?.message);
  }

  /**
   * Creates a TODO.
   * @param {any} event 
   */
  createTodo(event: any): void {
    this.todoService.createTodo({
      todoName: this.todoName,
      complete: false
    }).subscribe(() => {
      this.todoName = '';
      this.createTodoError = null;
    }, (error: IError) => {
      this.createTodoError = error.message;
    });
  }

  /**
   * Deletes a TODO.
   * @param {string} itemId 
   */
  deleteTodo(itemId: string): void {
    this.todoService.deleteTodo(itemId)
    .subscribe(() => {
      this.updateTodoError = null;
    }, (error: IError) => {
      this.updateTodoError = error.message;
    });
  }
  
  /**
   * Toggles the completed state of the TODO.
   * @param {IItem<Itodo>} todo 
   */
  toggleCompleted(todo: IItem<ITodo>): void {
    this.todoService.updateTodo(todo.itemId, {
      ...todo.item,
      complete: !todo.item.complete
    }).subscribe((result) => {
      this.updateTodoError = null;
    }, (error: IError) => {
      this.updateTodoError = error.message;
    });
  }

  /**
   * Shares the TODOs list with a user.
   * @param {any} event 
   */
  shareTodos(event: any): void {
    this.databaseService.shareDatabase({
      databaseName: environment.TODOS_DB,
      username: this.username
    }).subscribe(() => {
      this.sharedWith.push({
        username: this.username,
        isOwner: false,
        readOnly: true,
        resharingAllowed: false
      });
      this.username = '';
      this.shareTodosError = null;
    }, (error: IError) => {
      this.shareTodosError = error.message;
    });
  }

  /**
   * Revokes a user's access to their todos database.
   * @param {string} username 
   */
  revokeAccess(username: string): void {
    this.databaseService.revokeDatabaseAccess({
      databaseName: 'todos',
      username
    }).subscribe((response) => {
      this.sharedWith = this.sharedWith.filter((user: DatabaseUsers) => user.username !== username);
      this.revokeAccessError = null;
    }, (error: IError) => {
      this.revokeAccessError = error.message;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (this.cd) {
      this.cd.detach();
    }
  }

}
