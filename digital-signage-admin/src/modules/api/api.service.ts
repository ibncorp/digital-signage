import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { 

  }

  create(endpoint: string, data: any, options?: any){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    });

    if(options){
      return this.http.post<any>(environment.API_URL + endpoint, data, Object.assign(options, headers)).pipe(
        catchError(
            error => {
              localStorage.setItem('isLoggedIn','false'); 
              this.router.navigate(['auth/login']);
              return of(error)
            }
        )
      );
    }else{
      return this.http.post<any>(environment.API_URL + endpoint, data, { headers: headers }).pipe(
        catchError(
            error => {
              localStorage.setItem('isLoggedIn','false'); 
              this.router.navigate(['auth/login']);
              return of(error)
            }
        )
      );
    }
  }

  read(endpoint: string, params?: any){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    });

    if(params != null){
      const query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
      
      return this.http.get<any>(environment.API_URL + endpoint + '?' + query, {headers : headers}).pipe(
        catchError(
            error => {
              localStorage.setItem('isLoggedIn','false'); 
              this.router.navigate(['auth/login']);
              return of(error)
            }
        )
      );
    }

    return this.http.get<any>(environment.API_URL + endpoint, {headers : headers}).pipe(
      catchError(
          error => {
            localStorage.setItem('isLoggedIn','false'); 
            this.router.navigate(['auth/login']);
            return of(error)
          }
      )
    );
  }

  update(endpoint: string, id: string, data: any, options?: any){

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    });

    if(options){
      return this.http.put<any>(environment.API_URL + endpoint + '/' + id, data, Object.assign(options, headers)).pipe(
        catchError(
            error => {
              localStorage.setItem('isLoggedIn','false'); 
              this.router.navigate(['auth/login']);
              return of(error)
            }
        )
      );
    }else{
      return this.http.put<any>(environment.API_URL + endpoint + '/' + id, data, { headers: headers }).pipe(
        catchError(
            error => {
              localStorage.setItem('isLoggedIn','false'); 
              this.router.navigate(['auth/login']);
              return of(error)
            }
        )
      );
    }
  }

  delete(endpoint: string, id: string){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    });

    return this.http.delete<any>(environment.API_URL + endpoint + '/' + id, {headers : headers}).pipe(
      catchError(
          error => {
            localStorage.setItem('isLoggedIn','false'); 
            this.router.navigate(['auth/login']);
            return of(error)
          }
      )
    );
  }
}
