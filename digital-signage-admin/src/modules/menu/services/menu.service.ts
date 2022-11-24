import { Injectable } from '@angular/core';
import { ApiService } from '@modules/api/api.service';
import { SortDirection } from '@modules/menu/directives';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Menu } from '../models';

interface SearchResult {
    menu_list: Menu[];
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

function sort(menu_list: Menu[], column: string, direction: string): Menu[] {
    if (direction === '') {
        return menu_list;
    } else {
        
        return [...menu_list].sort((a, b) => {
            const res = compare(a.media[column as keyof typeof a.media], b.media[column as keyof typeof b.media]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(menu: Menu, term: string) {
    return (
        menu.media.displayName.toLowerCase().includes(term.toLowerCase()) ||
        menu.media.description.toLowerCase().includes(term.toLowerCase())
    );
}

@Injectable({ providedIn: 'root' })
export class MenuService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _menu_list$ = new BehaviorSubject<Menu[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private MENU_LIST = [];

    private endpoint = 'content'

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

    getData(){
        return this.apiService.read(this.endpoint, {type: '1'});
    }

    loadData(){
        this.getData().subscribe(
            (result) => {
                if (result.error == false){
                    const data = result?.results?.data;
                    this.MENU_LIST = data;
        
                    this._search$
                        .pipe(
                            tap(() => this._loading$.next(true)),
                            debounceTime(120),
                            switchMap(() => this._search()),
                            delay(120),
                            tap(() => this._loading$.next(false))
                        )
                        .subscribe(result => {
                            this._menu_list$.next(result.menu_list);
                            this._total$.next(result.total);
                        });
            
                    this._search$.next();
                }
            }
        )
    }

    get menu_list$() {
        return this._menu_list$.asObservable();
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
        let menu_list = sort(this.MENU_LIST, sortColumn, sortDirection);

        // 2. filter
        menu_list = menu_list.filter(menu => matches(menu, searchTerm));
        const total = menu_list.length;

        // 3. paginate
        menu_list = menu_list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ menu_list, total });
    }
}
