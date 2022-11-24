import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { ApiService } from '@modules/api/api.service';
import { SortDirection } from '@modules/devices/directives';
import { Outlet } from '@modules/outlets/models';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Device } from '../models';

interface SearchResult {
    devices: Device[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
}

function compare(v1: number | string | Outlet, v2: number | string | Outlet) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(devices: Device[], column: string, direction: string): Device[] {
    if (direction === '') {
        return devices;
    } else {
        return [...devices].sort((a, b) => {
            const res = compare(a[column as keyof typeof a], b[column as keyof typeof b]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(country: Device, term: string, pipe: PipeTransform) {
    return (
        country.name.toLowerCase().includes(term.toLowerCase()) ||
        pipe.transform(country.name).includes(term) ||
        pipe.transform(country.description).includes(term)
    );
}

@Injectable({ providedIn: 'root' })
export class DeviceService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _devices$ = new BehaviorSubject<Device[]>([]);
    private _outlets$ = new BehaviorSubject<Outlet[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    private DEVICES: Device[] = [];

    private endpoint = 'device';
    private endpointOutlet = 'outlet';
    
    private _state: State = {
        page: 1,
        pageSize: 4,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(
        private pipe: DecimalPipe,
        private apiService: ApiService,
    ) {

        this.loadData();
    }

    deleteData(id: string){
        return this.apiService.delete(this.endpoint, id);
    }

    insertData(data: any){
        return this.apiService.create(this.endpoint, data);
    }

    updateData(id: string, data: any){
        return this.apiService.update(this.endpoint, id, data)
    }

    loadData(){
        this.apiService.read(this.endpointOutlet).subscribe(
            (result) => {
                if (result.error == false){
                    const data = result?.results?.data;
                    this._outlets$.next(data);                    
                }
            }
        )

        this.getData().subscribe(
            (result) => {
                if (result.error == false){
                    const data = result?.results?.data;
                    this.DEVICES = data;
        
                    this._search$
                        .pipe(
                            tap(() => this._loading$.next(true)),
                            debounceTime(120),
                            switchMap(() => this._search()),
                            delay(120),
                            tap(() => this._loading$.next(false))
                        )
                        .subscribe(result => {
                            this._devices$.next(result.devices);
                            this._total$.next(result.total);
                        });
            
                    this._search$.next();
                }
            }
        )
    }    
    
    getData(){
        return this.apiService.read(this.endpoint);
    }

    getDataByType(type: string){
        return this.apiService.read(this.endpoint, {type: type});
    }

    get outlets$() {
        return this._outlets$.asObservable();
    }

    get devices$() {
        return this._devices$.asObservable();
    }
    get total$() {
        return this._total$.asObservable();
    }
    get loading$() {
        return this._loading$.asObservable();
    }
    get page() {
        return this._state.page;
    }
    set page(page: number) {
        this._set({ page });
    }
    get pageSize() {
        return this._state.pageSize;
    }
    set pageSize(pageSize: number) {
        this._set({ pageSize });
    }
    get searchTerm() {
        return this._state.searchTerm;
    }
    set searchTerm(searchTerm: string) {
        this._set({ searchTerm });
    }
    set sortColumn(sortColumn: string) {
        this._set({ sortColumn });
    }
    set sortDirection(sortDirection: SortDirection) {
        this._set({ sortDirection });
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // 1. sort
        let devices = sort(this.DEVICES, sortColumn, sortDirection);

        // 2. filter
        devices = devices.filter(country => matches(country, searchTerm, this.pipe));
        const total = devices.length;

        // 3. paginate
        devices = devices.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ devices, total });
    }
}
