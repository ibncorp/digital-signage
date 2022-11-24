import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@modules/api/api.service';
import { SortDirection } from '@modules/media/directives';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Media } from '../models';

interface SearchResult {
    video_list: Media[];
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

function sort(video_list: Media[], column: string, direction: string): Media[] {
    if (direction === '') {
        return video_list;
    } else {
        return [...video_list].sort((a, b) => {
            const res = compare(a[column as keyof typeof a], b[column as keyof typeof b]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(video: Media, term: string) {
    return (
        video.displayName.toLowerCase().includes(term.toLowerCase()) ||
        video.description.toLowerCase().includes(term.toLowerCase())
    );
}

@Injectable({ providedIn: 'root' })
export class VideoService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _video_list$ = new BehaviorSubject<Media[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    private VIDEO_LIST: Media[] = [];

    private endpoint = 'media';

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
        return this.apiService.update(this.endpoint, id, data, 
            { 
                reportProgress: true,
                observe: 'events'
            }
        );
    }

    insertData(data: any){
        return this.apiService.create(this.endpoint, data, 
            { 
                reportProgress: true,
                observe: 'events'
            }
        );
    }

    loadData(){
        this.getData().subscribe(
            (result) => {

                if (result.error == true){
                    return of(false);
                }

                const data = result?.results?.data;
                this.VIDEO_LIST = data;
    
                this._search$
                    .pipe(
                        tap(() => this._loading$.next(true)),
                        debounceTime(120),
                        switchMap(() => this._search()),
                        delay(120),
                        tap(() => this._loading$.next(false))
                    )
                    .subscribe(result => {
                        this._video_list$.next(result.video_list);
                        this._total$.next(result.total);
                    });
        
                this._search$.next();

                return of(true);
            }
        )
    }
    
    getData(){
        return this.apiService.read(this.endpoint, {type: '2'});
    }

    get video_list$() {
        return this._video_list$.asObservable();
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
        let video_list = sort(this.VIDEO_LIST, sortColumn, sortDirection);

        // 2. filter
        video_list = video_list.filter(video => matches(video, searchTerm));
        const total = video_list.length;

        // 3. paginate
        video_list = video_list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ video_list, total });
    }
}
