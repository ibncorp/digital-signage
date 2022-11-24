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
import { SBSortableHeaderDirective, SortEvent } from '@modules/promo/directives';
import { Promo } from '@modules/promo/models';
import { PromoService } from '@modules/promo/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-promo-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './promo-list.component.html',
    styleUrls: ['promo-list.component.scss'],
})
export class PromoListComponent implements OnInit {
    @Input() pageSize = 4;

    promo_list$!: Observable<Promo[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;
    promo2D_list!: Promo[];

    isDisplayOption: any[] = [];

    apiUrl = environment.API_URL;

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    @Output() onPreviewEvent = new EventEmitter<Promo>()
    @Output() onEditEvent = new EventEmitter<Promo>()
    @Output() onDeleteEvent = new EventEmitter<Promo>()
    
    constructor(
        public promoService: PromoService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.promoService.pageSize = this.pageSize;
        this.promo_list$ = this.promoService.promo_list$;
        this.total$ = this.promoService.total$;

        this.promo_list$.subscribe(
            (result: Promo[]) => {
                this.promo2D_list = this.convertTo2DArray(result);
            }
        )
    }

    edit(data: Promo){
        this.onEditEvent.emit(data);
    }

    delete(data: Promo){
        this.onDeleteEvent.emit(data);
    }

    preview(data: Promo){
        this.onPreviewEvent.emit(data);
    }

    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.promoService.sortColumn = column;
        this.promoService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }

    convertTo2DArray(_promo: Promo[]){
        let promo2D: any[] = [];
        let promo1D: any[] = [];

        let lastDeviceId: string;

        _promo.forEach(
            (promo, index) => {
                if(lastDeviceId){
                    if(lastDeviceId != promo.device.id){
                        promo2D.push(promo1D);
                        promo1D = [];    
                    }
                }
                
                promo1D.push(promo);
                
                if(index == _promo.length - 1){
                    promo2D.push(promo1D);   
                }
                lastDeviceId = promo.device.id;
            }
        );
        return promo2D
    }
}
