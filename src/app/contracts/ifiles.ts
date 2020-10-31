import { FileUploadProgressHandler } from 'userbase-js';

export interface IFile {
  fileName: string;
}

export interface IUploadFileDto {
  itemId: string;
  file: File;
  progressHandler: FileUploadProgressHandler;
}

export interface IUploadProgress {
  bytesTransferred: number;
}