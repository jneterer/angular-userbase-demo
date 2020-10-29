import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserResult } from 'userbase-js';
import { IError } from '../../contracts/iuserbase';
import { UserbaseService } from '../../userbase.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  signInError: string = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: UserbaseService) { }

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Signs the user in.
   * @param {any} event 
   */
  signIn(event: any): void {
    if (this.signInForm.valid) {
      this.authService.signIn(this.signInForm.value)
      .subscribe((user: UserResult) => {
        // Show the user they need to reset their password on the account page.
        if (user.usedTempPassword) {
          this.router.navigate(['/app/account'], {
            queryParams: {
              changePasswordRequired: true
            }
          });
        } else {
          this.router.navigate(['/app']);
        }
      }, (error: IError) => {
        if (error.name === 'UserAlreadySignedIn') {
          this.router.navigate(['/app']);
        } else {
          this.signInError = error.message;
        }
      });
    }
  }

}
