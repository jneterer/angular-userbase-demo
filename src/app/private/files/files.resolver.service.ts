import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FilesService } from '../files/files.service';

@Injectable({ 
  providedIn: 'root' 
})
export class FilesResolver implements Resolve<void> {

  constructor(private filesService: FilesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return this.filesService.getFiles();
  }
}