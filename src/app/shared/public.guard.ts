import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Session, UserResult } from 'userbase-js';
import { UserbaseService } from '../userbase.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private userbaseService: UserbaseService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canProceed();
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canProceed();
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return <Observable<boolean>>this.canProceed(true);
  }

  canProceed(canLoad: boolean = false): Observable<boolean> {
    // If the app is initialized, determine if the user has been logged in.
    if (this.userbaseService.isInitialized) {
      const user: UserResult = this.userbaseService.getCurrentUser();
      // If the user is logged in, redirect them to the todos page.
      if (user) {
        return from(this.router.navigate(['/app/todos']));
      }
      // If not, let them continue.
      return of(true);
    } else {
      // If the application has not been initialized, initialize it.
      return this.userbaseService.initializeUserbase()
      .pipe(
        mergeMap((session: Session) => {
          // If the user is logged in, redirect them to the todos page.
          if (session.user) {
            return from(this.router.navigate(['/app/todos']));
          }
          // If not, let them continue.
          return of(true);
        }),
        catchError(() => {
          console.log('q')
          // If there was an error initializing userbase, redirect them
          // to the 500 page where the app will continue attempting to initialize.
          return from(this.router.navigate(['/500']));
        })
      );
    }
  }
  
}
