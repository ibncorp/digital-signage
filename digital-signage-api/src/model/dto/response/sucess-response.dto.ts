import { DataObjectResponse } from './data-object-response.dto';

export class SuccessResponse {
  
  error: boolean;
  code: number;
  message: string;
  results: DataObjectResponse;

  constructor(code: number, message: string, data?: any) {
    this.code = code;
    this.error = false;
    this.message = message;

    if(data){
      this.results = {
        data: data
      }
    }else{
      delete this.results;
    }
  }
}
