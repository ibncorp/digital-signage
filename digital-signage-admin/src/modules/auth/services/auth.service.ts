import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient,
    ) {}

    getAuth$(): Observable<{}> {
        return of({});
    }

    login(data: any): Observable<any>{
        return this.http.post<any>(environment.API_URL + 'auth/login', data).pipe(
            catchError(
                error => {
                    return of(error)
                }
            )
        );
    }

    register(data: any): Observable<any>{
        return this.http.post<any>(environment.API_URL + 'auth/register', data).pipe(
            catchError(
                error => {
                    return of(error)
                }
            )
        );
    }

    logout(){
        localStorage.setItem('isLoggedIn','false'); 
        localStorage.removeItem('fullName');
        localStorage.removeItem('email');
        localStorage.removeItem('accessToken');
    }
}
