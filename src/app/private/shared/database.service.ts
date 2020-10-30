import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import userbase, { Database, DatabasesResult } from 'userbase-js';
import { IRevokeAccess, IShareDBDto } from '../../contracts/idatabases';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  /**
   * Gets the databases the user owns. Optionally request only one database
   * given a database name.
   * @param {string} databaseName 
   * @returns {Observable<Database[]>}
   */
  getDatabases(databaseName: string = null): Observable<Database[]> {
    return from(databaseName ? userbase.getDatabases({ databaseName }) : userbase.getDatabases())
    .pipe(map((response: DatabasesResult) => {
      return response.databases;
    }));
  }

  /**
   * Shares a database with a user.
   * @param {IShareDBDto} shareDBDto 
   * @returns {Observable<void>}
   */
  shareDatabase(shareDBDto: IShareDBDto): Observable<void> {
    return from(userbase.shareDatabase({
      ...shareDBDto,
      requireVerified: false
    }));
  }

  /**
   * Shares a database with a user.
   * @param {IRevokeAccess} revokeAccess 
   * @returns {Observable<void>}
   */
  revokeDatabaseAccess(revokeAccess: IRevokeAccess): Observable<void> {
    return from(userbase.modifyDatabasePermissions({
      ...revokeAccess,
      revoke: true
    }));
  }

}
