import { TestBed } from '@angular/core/testing';

import { MenuService } from './menu.service';

describe('MenuService', () => {
    let menuService: MenuService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MenuService],
        });
        menuService = TestBed.inject(MenuService);
    });

    describe('menu_list$', () => {
        it('should return Observable<Country[]>', () => {
            menuService.menu_list$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});
