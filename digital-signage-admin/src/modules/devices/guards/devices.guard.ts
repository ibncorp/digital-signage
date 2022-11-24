import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class DevicesGuard implements CanActivate {
    canActivate(): Observable<boolean> {
        return of(true);
    }
}
