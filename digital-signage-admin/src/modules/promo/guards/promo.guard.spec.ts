import { TestBed } from '@angular/core/testing';

import { PromoGuard } from './promo.guard';

describe('Promo Guards', () => {
    let devicesGuard: PromoGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [PromoGuard],
        });
        devicesGuard = TestBed.inject(PromoGuard);
    });

    describe('canActivate', () => {
        it('should return an Observable<boolean>', () => {
            devicesGuard.canActivate().subscribe(response => {
                expect(response).toEqual(true);
            });
        });
    });
});
