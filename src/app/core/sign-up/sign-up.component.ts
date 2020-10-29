import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserResult } from 'userbase-js';
import { IError } from '../../contracts/iuserbase';
import { UserbaseService } from '../../userbase.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  signUpError: string = null;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userbaseService: UserbaseService) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  /**
   * Signs a user up.
   * @param {any} event 
   */
  signUp(event: any): void {
    if (this.signUpForm.valid) {
      this.userbaseService.signUp(this.signUpForm.value)
      .subscribe((user: UserResult) => {
        this.router.navigate(['/app/todos']);
      }, (error: IError) => {
        this.signUpError = error.message;
      });
    }
  }
}
