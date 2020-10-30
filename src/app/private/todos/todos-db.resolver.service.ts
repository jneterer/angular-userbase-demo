import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Database } from 'userbase-js';
import { DatabaseService } from '../shared/database.service';

@Injectable({ 
  providedIn: 'root' 
})
export class TodosDBResolver implements Resolve<Database[]> {

  constructor(private userbaseService: DatabaseService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Database[]> {
    return this.userbaseService.getDatabases();
  }

}