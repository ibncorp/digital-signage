import { TestBed } from '@angular/core/testing';

import { DevicesGuard } from './devices.guard';

describe('Devices Guards', () => {
    let devicesGuard: DevicesGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [DevicesGuard],
        });
        devicesGuard = TestBed.inject(DevicesGuard);
    });

    describe('canActivate', () => {
        it('should return an Observable<boolean>', () => {
            devicesGuard.canActivate().subscribe(response => {
                expect(response).toEqual(true);
            });
        });
    });
});
