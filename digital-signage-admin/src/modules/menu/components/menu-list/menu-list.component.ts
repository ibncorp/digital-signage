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
import { SBSortableHeaderDirective, SortEvent } from '@modules/menu/directives';
import { Menu } from '@modules/menu/models';
import { MenuService } from '@modules/menu/services';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Component({
    selector: 'sb-menu-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './menu-list.component.html',
    styleUrls: ['menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
    @Input() pageSize = 4;

    menu_list$!: Observable<Menu[]>;
    total$!: Observable<number>;
    sortedColumn!: string;
    sortedDirection!: string;

    isDisplayOption: any[] = [];

    menu2D_list!: Menu[];

    apiUrl = environment.API_URL;

    @ViewChildren(SBSortableHeaderDirective) headers!: QueryList<SBSortableHeaderDirective>;

    @Output() onPreviewEvent = new EventEmitter<Menu>()
    @Output() onEditEvent = new EventEmitter<Menu>()
    @Output() onDeleteEvent = new EventEmitter<Menu>()
    
    constructor(
        public menuService: MenuService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.menuService.pageSize = this.pageSize;
        this.menu_list$ = this.menuService.menu_list$;
        this.total$ = this.menuService.total$;

        this.menu_list$.subscribe(
            (result: Menu[]) => {
                this.menu2D_list = this.convertTo2DArray(result);
                console.log(this.menu2D_list);
            }
        )
    }

    edit(data: Menu){
        this.onEditEvent.emit(data);
    }

    delete(data: Menu){
        this.onDeleteEvent.emit(data);
    }

    preview(data: Menu){
        this.onPreviewEvent.emit(data);
    }

    onSort({ column, direction }: SortEvent) {
        this.sortedColumn = column;
        this.sortedDirection = direction;
        this.menuService.sortColumn = column;
        this.menuService.sortDirection = direction;
        this.changeDetectorRef.detectChanges();
    }

    convertTo2DArray(_menu: Menu[]){
        let menu2D: any[] = [];
        let menu1D: any[] = [];

        let lastDeviceId: string;

        _menu.forEach(
            (menu, index) => {
                if(lastDeviceId){
                    if(lastDeviceId != menu.device.id){
                        menu2D.push(menu1D);
                        menu1D = [];    
                    }
                }
                
                menu1D.push(menu);
                
                if(index == _menu.length - 1){
                    menu2D.push(menu1D);   
                }
                lastDeviceId = menu.device.id;
            }
        );
        return menu2D
    }
}
