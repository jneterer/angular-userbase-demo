import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import userbase, { Session, UserResult } from 'userbase-js';
import { environment } from '../environments/environment';
import { IError, IForgotPasswordDto, ISignInDto, ISignUpDto, IUpdateAccountDto } from './contracts/iuserbase';

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
        .catch((error: IError) => {
          this.initialized.next(false);
        })
        .finally(() => {
          resolve();
        });
    });
  }

  /**
   * Signs in the user.
   * @param {ISignInDto} signinDto 
   * @returns {Observable<UserResult>}
   */
  signIn(signinDto: ISignInDto): Observable<UserResult> {
    return from(userbase.signIn(signinDto))
    .pipe(
      map((user: UserResult) => {
        this.currentUser.next(user);
        return user;
      })
    );
  }

  /**
   * Signs the user up.
   * @param {ISignUpDto} signUpDto 
   * @returns {Observable<UserResult>}
   */
  signUp(signUpDto: ISignUpDto): Observable<UserResult> {
    return from(userbase.signUp(signUpDto))
    .pipe(
      map((user: UserResult) => {
        this.currentUser.next(user);
        return user;
      })
    );
  }

  /**
   * Submits a forgot password request which sends an email to the user
   * with a temporary password.
   * @param {IForgotPasswordDto} forgotPasswordDto 
   * @returns {Obserable<void>}
   */
  forgotPassword(forgotPasswordDto: IForgotPasswordDto): Observable<void> {
    return from(userbase.forgotPassword(forgotPasswordDto));
  }

  /**
   * Signs the user out.
   * @returns {Observable<void>}
   */
  signOut(): Observable<void> {
    return from(userbase.signOut())
    .pipe(
      map(() => {
        this.currentUser.next(null);
      }),
      catchError((error: IError) => {
        this.currentUser.next(null);
        return throwError(error);
      })
    );
  }

  /**
   * Updates the user's account with either profile info or a new password.
   * @param {IUpdateAccountDto}  
   * @returns {Observable<void>}
   */
  updateAccount(updateProfileDto: IUpdateAccountDto): Observable<void> {
    return from(userbase.updateUser(updateProfileDto))
    .pipe(
      map(() => {
        // Only update the user if we aren't changing their password.
        if (!updateProfileDto.currentPassword && !updateProfileDto.newPassword) {
          let newUser: UserResult = <UserResult>Object.assign({}, updateProfileDto);
          this.updateUser(newUser);
        }
      })
    );
  }

  /**
   * Deletes the user's account.
   * @returns {Observable<void>}
   */
  deleteAccount(): Observable<void> {
    return from(userbase.deleteUser())
    .pipe(
      map(() => {
        this.clearUser()   
        return;
      })
    );
  }

  /**
   * Returns the current user.
   * @returns {UserResult}
   */
  getCurrentUser(): UserResult {
    return this.currentUser.value;
  }

  /**
   * Updates the current user.
   * @param {UserResult} user 
   */
  private updateUser(user: UserResult): void {
    this.currentUser.next(Object.assign({}, user));
  }

  /**
   * Clears the current user.
   */
  private clearUser(): void {
    this.currentUser.next(null);
  }

}
