import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { FileResult } from 'userbase-js';
import { IFile, IUploadProgress } from '../../contracts/ifiles';
import { IError, IItem } from '../../contracts/iuserbase';
import { FilesService } from './files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  files: IItem<IFile>[];
  getFilesError: string;
  fileName: string = '';
  @ViewChild('fileInput') fileInput: ElementRef;
  file: File;
  uploadProgress: number = null;
  uploadFileError: string;
  updateFileError: string;

  constructor(private cd: ChangeDetectorRef,
              private filesService: FilesService) { }

  ngOnInit(): void {
    this.filesService.files$.pipe(takeUntil(this.unsubscribe))
    .subscribe((files: IItem<IFile>[]) => this.files = files);
    this.filesService.getFilesError$.pipe(takeUntil(this.unsubscribe))
    .subscribe((error: IError) => this.getFilesError = error?.message);
  }

  /**
   * When the user selects a file, capture it and set the file 
   * name if the user hasn't provided one.
   * @param {FileList} files 
   */
  selectFile(files: FileList): void {
    this.file = files[0];
    if (!this.fileName) {
      this.fileName = this.file.name;
    }
  }

  /**
   * Creates an item that contains the file name that is used
   * to attach the file to.
   * @param {any} event 
   */
  uploadFile(event: any): void {
    if (this.fileName && this.file) {
      this.filesService.createFileItem(this.fileName)
      .pipe(
        mergeMap(() => {
          const uploadedItem: IItem<IFile> = this.files.find((file: IItem<IFile>) => {
            return file.item.fileName === this.fileName
          });
          this.uploadProgress = 0;
          this.cd.detectChanges();
          return this.filesService.uploadFile({
            itemId: uploadedItem.itemId,
            file: this.file,
            progressHandler: (uploadProgress: IUploadProgress) => this.uploadFileProgress(uploadProgress)
          });
        })
      ).subscribe(() => {
      }, (error: IError) => {
        this.uploadFileError = error.message;
      });
    }
  }

  /**
   * Tracks the file upload progress in case of larger files, we can
   * display the progress to the user.
   * @param {IUploadProgress} uploadProgress 
   */
  uploadFileProgress(uploadProgress: IUploadProgress): void {
    if (this.file.size === uploadProgress.bytesTransferred) {
      this.fileName = '';
      this.file = null;
      if (this.fileInput) {
        this.fileInput.nativeElement.value = null;
      }
      this.uploadFileError = null;
      this.uploadProgress = null;
    } else {
      this.uploadProgress =  uploadProgress.bytesTransferred / this.file.size;
    }
    this.cd.detectChanges();
  }

  /**
   * Downloads the file.
   * @param {string} fileId 
   */
  downloadFile(fileId: string): void {
    this.filesService.getFile(fileId)
    .subscribe(({ file }: FileResult) => {
      const blob = new Blob([ file ], { type : file.type });
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
      downloadLink.setAttribute('download', file.name);
      downloadLink.click();
      downloadLink.remove();
    }, (error: IError) => {
      this.updateFileError = error.message;
    });
  }

  /**
   * Deletes a file.
   * @param {string} itemId 
   */
  deleteFile(itemId: string): void {
    this.filesService.deleteFile(itemId)
    .subscribe(() => {
      this.updateFileError = null;
    }, (error: IError) => {
      this.updateFileError = error.message;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
