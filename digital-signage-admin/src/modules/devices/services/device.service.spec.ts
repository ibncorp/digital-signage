import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';

describe('DeviceService', () => {
    let countryService: DeviceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DeviceService, DecimalPipe],
        });
        countryService = TestBed.inject(DeviceService);
    });

    describe('countries$', () => {
        it('should return Observable<Country[]>', () => {
            countryService.countries$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});
