import { Component, OnInit } from '@angular/core';
import { IError } from '../../contracts/iuserbase';
import { UserbaseService } from '../../userbase.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  username: string = '';
  forgotPasswordError: string;
  forgotPasswordSuccess: boolean = false;

  constructor(private userbaseService: UserbaseService) { }

  ngOnInit(): void {
  }

  /**
   * Submits the forgot password request.
   * @param {any} event 
   */
  submitForgotPassword(event: any): void {
    if (this.username) {
      this.userbaseService.forgotPassword({ username: this.username })
      .subscribe(() => {
        this.forgotPasswordSuccess = true;
      }, (error: IError) => {
        this.forgotPasswordError = error.message;
      });
    }
  }

}
