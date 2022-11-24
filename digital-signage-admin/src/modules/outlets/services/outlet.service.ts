import { Injectable, PipeTransform } from '@angular/core';
import { ApiService } from '@modules/api/api.service';
import { SortDirection } from '@modules/outlets/directives';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Outlet } from '../models';

interface SearchResult {
    outlets: Outlet[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
}

function compare(v1: number | string, v2: number | string) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(outlets: Outlet[], column: string, direction: string): Outlet[] {
    if (direction === '') {
        return outlets;
    } else {
        return [...outlets].sort((a, b) => {
            
            const res = compare(a[column as keyof typeof a], b[column as keyof typeof b]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(outlet: Outlet, term: string) {
    return (
        outlet.code.toLowerCase().includes(term.toLowerCase()) ||
        outlet.name.toLowerCase().includes(term.toLowerCase()) 
    );
}

@Injectable({ providedIn: 'root' })
export class OutletService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _countries$ = new BehaviorSubject<Outlet[]>([]);
    private OUTLETS: Outlet[] = [];
    private _total$ = new BehaviorSubject<number>(0);

    private endpoint = 'outlet';

    private _state: State = {
        page: 1,
        pageSize: 4,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(        
        private apiService: ApiService
    ) {
        this.loadData();
    }

    deleteData(id: string){
        return this.apiService.delete(this.endpoint, id);
    }

    updateData(id: string, data: any){
        return this.apiService.update(this.endpoint, id, data);
    }

    insertData(data: any){
        return this.apiService.create(this.endpoint, data);
    }

    loadData(){
        this.apiService.read(this.endpoint).subscribe(
            (result) => {
                if (result.error == false){
                    const data = result?.results?.data;
                    this.OUTLETS = data;
    
                    this._search$
                        .pipe(
                            tap(() => this._loading$.next(true)),
                            debounceTime(120),
                            switchMap(() => this._search()),
                            delay(120),
                            tap(() => this._loading$.next(false))
                        )
                        .subscribe(result => {
                            this._countries$.next(result.outlets);
                            this._total$.next(result.total);
                        });
                    this._search$.next();
                }
            }
        )
    }

    get outlets$() {
        return this._countries$.asObservable();
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
        let outlets = sort(this.OUTLETS, sortColumn, sortDirection);

        // 2. filter
        outlets = outlets.filter(country => matches(country, searchTerm));
        const total = outlets.length;

        // 3. paginate
        outlets = outlets.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ outlets, total });
    }
}
