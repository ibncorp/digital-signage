import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { OutletService } from './outlet.service';

describe('OutletService', () => {
    let countryService: OutletService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [OutletService, DecimalPipe],
        });
        countryService = TestBed.inject(OutletService);
    });

    describe('outlets$', () => {
        it('should return Observable<Country[]>', () => {
            countryService.outlets$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});
