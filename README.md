<p align="center">
  <a href="" target="_blank">
    <img height="100" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/angular-userbase.jpg">
  </a>
</p>
<h1 align="center">Angular Userbase Demo</h1>

## Demo

There is a live demo deployed via netlify! Check it out here: [live demo](https://angular-userbase-demo.jacobneterer.com).

[![Netlify Status](https://api.netlify.com/api/v1/badges/48731b7c-dbcc-4373-b632-38a864c56fec/deploy-status)](https://app.netlify.com/sites/angular-userbase-demo/deploys)

## About

There are two things I love developing with, the first is the SPA framework <a href="https://angular.io" target="_blank">Angular</a> and the second is the End to End Encryption serverless SDK <a href="https://userbase.com" target="_blank">Userbase</a>. Angular is a great framework for developing web apps and Userbase gives you the tools to build a secure but dynamic, affordable web app without the hastle of worrying about a backend. I built this demo to show how easy it is to set up in Angular with the hopes that our community can build web apps with an amazing secure solution that is Userbase.

## 🧐 What's inside and what you should know for this project

    .
    └── src
        └── app
            ├── contracts
            └── core
                ├── forgot-password
                ├── initialization-error
                ├── sign-in
                ├── sign-up
            └── private
                ├── account
                ├── files
                ├── shared
                └── todos
            └── shared
            app-routing.module.ts
            app.**.*
            userbase.service.ts
    
1.  **`/contracts`**: Contains all additional types/interfaces we need to properly type our application. For example, interfaces for todos, files, and Userbase errors.
2. **`/core`**: This directory contains all core components that are only visible to unauthenticated users.
    1. **`/forgot-password`**: The forgot password page.
    2. **`/initialization-error`**: The initialization error page.
    3. **`/sign-in`**: The sign in page.
    4. **`/sign-up`**: The sign up page.
3. **`private`**: This directory contains all components that are only visible to authenticated users.
    1. **`/account`**: The account page.
    2. **`/files`**: The files page.
    3. **`/shared`**: Shared folder for any services, modules, etc. that might be needed in the private module.
    4. **`/todos`**: The todos page.
4.  **`/shared`**: This directory contains all shared services, modules, etc. that might be needed for unauthenticated pages.
5.  **`.app-routing.module.ts`**: The base routing file for our application.
6.  **`.app**.*`**: The base app component for our application.
7.  **`userbase.service.ts`**: The userbase service that contains our base functions like initializing the SDK, sign in, sign out, etc.

## Initializing Userbase

Userbase is a serverless SDK, so we have to initialize the SDK before we use it. In order to do this I've incorporated the intialization process in our `/shared/private.guard.ts` (protects modules and pages behind authentication) and `/shared/public.guard.ts` (redirects users from pages like sign in, sign up, and forgot password when they're already logged in).

If you look in both guards you will see we follow this process:

1. Determine if the SDK has been initialized
2. If it has, determine if the user is authenticated and perform logic. If not and the error was `ServiceUnavailable`, redirect the user to `/500`

One handy feature I've implemented on the `/500` page is the ability to continue attempting to initialize the SDK upon server failure. You will see in `/core/initialization-error/initialization-error.component.ts` that we retry initializing the SDK every 5 seconds indefinitely. If we are able to initialize the SDK, we redirect them to `/signin` if they're unauthorized or `/app/todos` if they're logged in.

## Sign Up

Signs the user up and automatically logs them in (this is out of the box functionality).
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/sign-up.gif">
</p>

## Sign In/Out

Signs the user in and redirects them to `/app/todos`. Also signs the user out and redirects them to `/signin`.
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/sign-in-out.gif">
</p>

## Forgot Password

### Submit Request

Submits a forgot password request, which off screen I go to my email and copy my temporary password.
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/forgot-password-1.gif">
</p>

### Log In with Temporary Pass -> Change Password

I then take my temporary password and log in. Once logged in I am automatically redirected to the `/app/account` page where I am asked to change my password (using my temporary password) before I continue using the application.
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/forgot-password-2.gif">
</p>

## Create, Update, and Delete Items

Creates (new todo), updates (sets completed state of todo), and deletes todos.
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/create-update-delete-todo.gif">
</p>

## Share Databases

Shares the user's todos database with other users via their username.
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/share-todos.gif">
</p>

## Upload Files

Uploads files to the users account. I provided an example with a file that is large and takes time to upload (the gif was sped up I believe 2 or 2.5 times to decrease the gif's file size, so it will be slower than shown).
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/upload-file.gif">
</p>

## Manage Account

Allows the user to update their email given on log in, change their password, and delete their account.
<p align="center">
  <img width="100%" src="https://github.com/jneterer/angular-userbase-demo/blob/master/src/assets/gifs/update-email-pass-delete-account.gif">
</p>

## Default Angular Generated README.md Content

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
