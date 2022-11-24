import { TestBed } from '@angular/core/testing';

import { MenuGuard } from './menu.guard';

describe('Menu Guards', () => {
    let devicesGuard: MenuGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [MenuGuard],
        });
        devicesGuard = TestBed.inject(MenuGuard);
    });

    describe('canActivate', () => {
        it('should return an Observable<boolean>', () => {
            devicesGuard.canActivate().subscribe(response => {
                expect(response).toEqual(true);
            });
        });
    });
});
