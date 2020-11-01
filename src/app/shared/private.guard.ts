import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { UserResult } from 'userbase-js';
import { UserbaseService } from '../userbase.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateGuard implements CanActivate, CanActivateChild, CanLoad {

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
    const user: UserResult = this.userbaseService.getCurrentUser();
    if (user) {
      return of(true);
    }
    return from(this.router.navigate(['/signin']));
  }
  
}
