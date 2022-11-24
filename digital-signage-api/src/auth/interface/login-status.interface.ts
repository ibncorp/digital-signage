export interface LoginStatus {
  username: string;
  accessToken: any;
  expiresIn: any;
  email: string;
  fullName: string;
  admin: boolean;
  newUser: boolean;
  authorized: boolean;
  remember: boolean;
}
