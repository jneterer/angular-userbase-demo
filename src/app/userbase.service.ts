import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import userbase, { Session, UserResult } from 'userbase-js';
import { Error } from './contacts/error';

@Injectable({
  providedIn: 'root'
})
export class UserbaseService {
  private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public $initialized: Observable<boolean> = this.initialized.asObservable();
  private currentUser: BehaviorSubject<UserResult> = new BehaviorSubject<UserResult>(null);
  public $currentUser: Observable<UserResult> = this.currentUser.asObservable();

  constructor() { }

  /**
   * Function used to initialized the application in app.module.ts.
   * @returns {Promise<Session>}
   */
  initializeUserbase(): Promise<Session> {
    return new Promise((resolve) => {
      userbase.init({ appId: environment.APP_ID })
        .then((session: Session) => {
          if (session.user) {
            this.currentUser.next(session.user);
          }
          this.initialized.next(true);
        })
        .catch((error: Error) => {
          this.initialized.next(false);
        })
        .finally(() => {
          resolve();
        });
    });
  }

}
