import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { SBSortableHeaderDirective, SortEvent } from '@modules/media/directives';
import { Media } from '@modules/media/models';
import { VideoService } from '@modules/media/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-video-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './video-list.component.html',
    styleUrls: ['video-list.component.scss'],
})
export class VideoListComponent implements OnInit {
    @Input() pageSize = 4;

    video_list$!: Observable<Media[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    isDisplayOption: any[] = [];
    currentTime!: number;
    
    apiUrl = environment.API_URL;

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    @Output() onPreviewEvent = new EventEmitter<Media>()
    @Output() onEditEvent = new EventEmitter<Media>()
    @Output() onDeleteEvent = new EventEmitter<Media>()
    
    constructor(
        public videoService: VideoService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.videoService.pageSize = this.pageSize;
        this.video_list$ = this.videoService.video_list$;
        this.total$ = this.videoService.total$;
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
        this.videoService.sortColumn = column;
        this.videoService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }
}
