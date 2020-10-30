import { IItem } from './iuserbase';

export interface ITodo {
  todoName: string;
  complete: boolean;
}

export interface ISharedTodoDb {
  databaseId: string;
  username: string;
  db: IItem<ITodo>[];
}