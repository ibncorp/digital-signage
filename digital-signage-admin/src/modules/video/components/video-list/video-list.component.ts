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
import { SBSortableHeaderDirective, SortEvent } from '@modules/video/directives';
import { Video } from '@modules/video/models';
import { ContentVideoService } from '@modules/video/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-content-video-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './video-list.component.html',
    styleUrls: ['video-list.component.scss'],
})
export class VideoListComponent implements OnInit {
    @Input() pageSize = 4;

    video_list$!: Observable<Video[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    video2D_list!: Video[];

    isDisplayOption: any[] = [];

    apiUrl = environment.API_URL;
    
    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    @Output() onPreviewEvent = new EventEmitter<Video>()
    @Output() onEditEvent = new EventEmitter<Video>()
    @Output() onDeleteEvent = new EventEmitter<Video>()
    
    constructor(
        public contentVideoService: ContentVideoService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.contentVideoService.pageSize = this.pageSize;
        this.video_list$ = this.contentVideoService.video_list$;
        this.total$ = this.contentVideoService.total$;

        this.video_list$.subscribe(
            (result: Video[]) => {
                this.video2D_list = this.convertTo2DArray(result);
            }
        )
    }

    edit(data: Video){
        this.onEditEvent.emit(data);
    }

    delete(data: Video){
        this.onDeleteEvent.emit(data);
    }

    preview(data: Video){
        this.onPreviewEvent.emit(data);
    }

    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.contentVideoService.sortColumn = column;
        this.contentVideoService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }

    convertTo2DArray(_video: Video[]){
        let video2D: any[] = [];
        let video1D: any[] = [];

        let lastDeviceId: string;

        _video.forEach(
            (video, index) => {
                if(lastDeviceId){
                    if(lastDeviceId != video.device.id){
                        video2D.push(video1D);
                        video1D = [];    
                    }
                }
                
                video1D.push(video);
                
                if(index == _video.length - 1){
                    video2D.push(video1D);   
                }
                lastDeviceId = video.device.id;
            }
        );
        return video2D
    }
}
