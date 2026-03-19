export enum UserRole {
  ADMIN = 'SuperAdmin',
  USER = 'User',
}

export type QueryStringToken = {
  token: string;
};

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}
