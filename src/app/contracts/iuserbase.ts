import { RememberMeOption } from 'userbase-js';

export interface ISignInDto {
  username: string;
  password: string;
  rememberMe?: RememberMeOption;
  sessionLength?: number
}

export interface ISignUpDto {
  username: string;
  password: string;
  email: string;
}

export interface IForgotPasswordDto {
  username: string;
}

export interface IError {
  name: string;
  message: string;
  status: 400;
  username?: string;
}