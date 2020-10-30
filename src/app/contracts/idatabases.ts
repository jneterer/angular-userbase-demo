export interface IShareDBDto {
  databaseName: string;
  databaseId?: string;
  username: string;
  requireVerified?: boolean;
  readOnly?: boolean;
  resharingAllowed?: boolean;
}

export interface IRevokeAccess {
  databaseName: string;
  username: string;
}