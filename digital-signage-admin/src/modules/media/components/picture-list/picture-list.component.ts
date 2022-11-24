import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { SBSortableHeaderDirective, SortEvent } from '@modules/media/directives';
import { Media } from '@modules/media/models';
import { PictureService } from '@modules/media/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-picture-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './picture-list.component.html',
    styleUrls: ['picture-list.component.scss'],
})
export class PictureListComponent implements OnInit {
    @Input() pageSize = 4;

    picture_list$!: Observable<Media[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    isDisplayOption: any[] = [];

    apiUrl = environment.API_URL;

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    @Output() onPreviewEvent = new EventEmitter<Media>()
    @Output() onEditEvent = new EventEmitter<Media>()
    @Output() onDeleteEvent = new EventEmitter<Media>()
    
    constructor(
        public pictureService: PictureService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.pictureService.pageSize = this.pageSize;
        this.picture_list$ = this.pictureService.picture_list$;
        this.total$ = this.pictureService.total$;
    }

    edit(data: Media){
        this.onEditEvent.emit(data);
    }

    delete(data: Media){
        this.onDeleteEvent.emit(data);
    }

    preview(data: Media){
        this.onPreviewEvent.emit(data);
    }

    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.pictureService.sortColumn = column;
        this.pictureService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }
}
