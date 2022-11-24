import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@modules/api/api.service';
import { SortDirection } from '@modules/promo/directives';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Promo } from '../models';

interface SearchResult {
    promo_list: Promo[];
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

function sort(promo_list: Promo[], column: string, direction: string): Promo[] {
    if (direction === '') {
        return promo_list;
    } else {
        
        return [...promo_list].sort((a, b) => {
            const res = compare(a.media[column as keyof typeof a.media], b.media[column as keyof typeof b.media]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(promo: Promo, term: string) {
    return (

        promo.media.displayName.toLowerCase().includes(term.toLowerCase()) ||
        promo.media.description.toLowerCase().includes(term.toLowerCase()) ||
        promo.device.code.toLowerCase().includes(term.toLowerCase()) ||
        promo.device.name.toLowerCase().includes(term.toLowerCase())
    );
}

@Injectable({ providedIn: 'root' })
export class PromoService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _promo_list$ = new BehaviorSubject<Promo[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private PROMO_LIST: Promo[] = [];

    private endpoint = 'content';

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
        return this.apiService.create(this.endpoint, data)
    }

    loadData(){
        this.getData().subscribe(
            (result) => {
                if (result.error == false){
                    const data = result?.results?.data;
                    this.PROMO_LIST = data;
        
                    this.PROMO_LIST = this.PROMO_LIST.sort((a, b) => {
                        if (a.device.id < b.device.id) {
                            return -1;
                        }
                        if (a.device.id > b.device.id) {
                            return 1;
                        }
                        return 0;
                    });

                    this._search$
                        .pipe(
                            tap(() => this._loading$.next(true)),
                            debounceTime(120),
                            switchMap(() => this._search()),
                            delay(120),
                            tap(() => this._loading$.next(false))
                        )
                        .subscribe(result => {
                            this._promo_list$.next(result.promo_list);
                            this._total$.next(result.total);
                        });
            
                    this._search$.next();
                }
            }
        )
    }

    getData(){
        return this.apiService.read(this.endpoint, {type: '2'});
    }

    get promo_list$() {
        return this._promo_list$.asObservable();
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
        let promo_list = sort(this.PROMO_LIST, sortColumn, sortDirection);

        // 2. filter
        promo_list = promo_list.filter(promo => matches(promo, searchTerm));
        const total = promo_list.length;

        // 3. paginate
        promo_list = promo_list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ promo_list, total });
    }
}
