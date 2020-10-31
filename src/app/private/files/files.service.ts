import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import userbase, { FileResult } from 'userbase-js';
import { environment } from '../../../environments/environment';
import { IFile, IUploadFileDto } from '../../contracts/ifiles';
import { IError, IItem } from '../../contracts/iuserbase';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private files: BehaviorSubject<IItem<IFile>[]> = new BehaviorSubject<IItem<IFile>[]>([]);
  public files$: Observable<IItem<IFile>[]> = this.files.asObservable();
  private getFilesError: BehaviorSubject<IError> = new BehaviorSubject<IError>(null);
  public getFilesError$: Observable<IError> = this.getFilesError.asObservable();

  constructor() { }

  /**
   * Gets the list of files for the user.
   * @returns {Observable<void>}
   */
  getFiles(): Observable<void> {
    return from(userbase.openDatabase({
      databaseName: environment.FILES_DB,
      changeHandler: (files: IItem<IFile>[]) => {
        this.files.next(files);
      }
    })).pipe(
      catchError((error: IError) => {
        this.getFilesError.next(error);
        return throwError(error);
      })
    );
  }

  /**
   * Gets a file for download.
   * @param {string} fileId 
   * @returns {Observable<FileResult}
   */
  getFile(fileId: string): Observable<FileResult> {
    return from(userbase.getFile({
      databaseName: environment.FILES_DB,
      fileId
    }));
  }

  /**
   * Creates a file.
   * @param {string} fileName 
   * @returns {Observable<void>}
   */
  createFileItem(fileName: string): Observable<void> {
    return from(userbase.insertItem({
      databaseName: environment.FILES_DB,
      item: {
        fileName: fileName
      }
    }));
  }

  /**
   * Uploads a file.
   * @param {IUploadFileDto} uploadFileDto
   * @returns {Observable<any>} 
   */
  uploadFile(uploadFileDto: IUploadFileDto): Observable<void> {
    return from(userbase.uploadFile({
      ...uploadFileDto,
      databaseName: environment.FILES_DB
    }));
  }

  /**
   * Deletes a file.
   * @param {string} itemId
   * @returns {Observable<void>}
   */
  deleteFile(itemId: string): Observable<void> {
    return from (userbase.deleteItem({
      databaseName: environment.FILES_DB,
      itemId: itemId
    }));
  }

}
