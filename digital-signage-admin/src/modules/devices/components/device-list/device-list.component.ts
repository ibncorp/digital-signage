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
import { SBSortableHeaderDirective, SortEvent } from '@modules/devices/directives';
import { Device } from '@modules/devices/models';
import { DeviceService } from '@modules/devices/services';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-device-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './device-list.component.html',
    styleUrls: ['device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
    @Input() pageSize = 4;

    devices$!: Observable<Device[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    @Output() onPreviewEvent = new EventEmitter<Device>()
    @Output() onEditEvent = new EventEmitter<Device>()
    @Output() onDeleteEvent = new EventEmitter<Device>()

    constructor(
        public deviceService: DeviceService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.devices$ = this.deviceService.devices$;

        this.deviceService.pageSize = this.pageSize;

        this.total$ = this.deviceService.total$;
    }


    edit(data: Device){
        this.onEditEvent.emit(data);
    }

    delete(data: Device){
        this.onDeleteEvent.emit(data);
    }

    preview(data: Device){
        this.onPreviewEvent.emit(data);
    }

    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.deviceService.sortColumn = column;
        this.deviceService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }
}
