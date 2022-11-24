import { TestBed } from '@angular/core/testing';

import { PromoService } from './promo.service';

describe('PromoService', () => {
    let promoService: PromoService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PromoService],
        });
        promoService = TestBed.inject(PromoService);
    });

    describe('promo_list$', () => {
        it('should return Observable<Country[]>', () => {
            promoService.promo_list$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});
