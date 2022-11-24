export class ErrorResponse {
 
  error: boolean;
  code: number;
  message: string;
  
  constructor(code: number, message: string) {
    this.code = code;
    this.error = true;
    this.message = message;
  }
}
