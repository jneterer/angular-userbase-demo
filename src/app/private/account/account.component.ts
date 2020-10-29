import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserResult } from 'userbase-js';
import { IError, IUpdateAccountDto } from '../../contracts/iuserbase';
import { UserbaseService } from '../../userbase.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  user: UserResult;
  changePasswordRequired: boolean = false;
  email: string = '';
  saveProfileSuccess: boolean;
  saveProfileError: string;
  changePasswordForm: FormGroup;
  changePasswordSuccess: boolean;
  changePasswordError: string;
  wantsToDelete: boolean = false;
  deleteAccountError: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private userbaseService: UserbaseService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: '',
      newPassword: ''
    });
    this.userbaseService.$currentUser.pipe(takeUntil(this.unsubscribe))
    .subscribe((user: UserResult) => {
      if (user) {
        this.user = user;
        this.email = user.email;
      }
    });
    this.route.queryParams.pipe(takeUntil(this.unsubscribe))
    .subscribe((params: Params) => this.changePasswordRequired = params.changePasswordRequired);
  }

  /**
   * Save the user's profile info.
   * @param {any} event 
   */
  saveProfileInfo(event: any): void {
    let updateAccountDto: IUpdateAccountDto = {
      username: this.user.username,
      email: this.email
    };
    this.userbaseService.updateAccount(updateAccountDto)
    .subscribe(() => {
      this.saveProfileError = null;
      this.saveProfileSuccess = true;
    }, (error: IError) => {
      this.saveProfileSuccess = false;
      this.saveProfileError = error.message;
    });
  }

  /**
   * Changes the user's password.
   * @param {any} event 
   */
  changePassword(event: any): void {
    if (this.changePasswordForm.valid) {
      const updateAccountDto: IUpdateAccountDto = {
        username: this.user.username,
        currentPassword: this.changePasswordForm.get('currentPassword').value,
        newPassword: this.changePasswordForm.get('newPassword').value
      };
      this.userbaseService.updateAccount(updateAccountDto)
      .subscribe(() => {
        this.changePasswordRequired = false;
        this.changePasswordError = null;
        this.changePasswordSuccess = true;
        this.changePasswordForm.reset();
      }, (error: IError) => {
        this.changePasswordSuccess = false;
        this.changePasswordError = error.message;
      });
    }
  }

  /**
   * Deletes a user's account and redirects them home.
   * @param {any} event 
   */
  deleteAccount(event: any): void {
    if (this.wantsToDelete) {
      this.userbaseService.deleteAccount()
      .subscribe(() => {
        this.router.navigate(['/signin']);
      }, (error: IError) => {
        this.deleteAccountError = error.message;
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
