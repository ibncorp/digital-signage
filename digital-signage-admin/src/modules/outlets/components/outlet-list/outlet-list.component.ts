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
import { OutletsComponent } from '@modules/outlets/containers';
import { SBSortableHeaderDirective, SortEvent } from '@modules/outlets/directives';
import { Outlet } from '@modules/outlets/models';
import { OutletService } from '@modules/outlets/services';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-outlet-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './outlet-list.component.html',
    styleUrls: ['outlet-list.component.scss'],
})
export class OutletListComponent implements OnInit {
    @Input() pageSize = 4;

    outlets$!: Observable<Outlet[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;


    @Output() onPreviewEvent = new EventEmitter<Outlet>()
    @Output() onEditEvent = new EventEmitter<Outlet>()
    @Output() onDeleteEvent = new EventEmitter<Outlet>()

    constructor(
        public outletService: OutletService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.outlets$ = this.outletService.outlets$;

        this.outletService.pageSize = this.pageSize;

        this.total$ = this.outletService.total$;
    }

    edit(data: Outlet){
        this.onEditEvent.emit(data);
    }

    delete(data: Outlet){
        this.onDeleteEvent.emit(data);
    }

    preview(data: Outlet){
        this.onPreviewEvent.emit(data);
    }

    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.outletService.sortColumn = column;
        this.outletService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }
}
