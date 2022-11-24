import { TestBed } from '@angular/core/testing';

import { MediaGuard } from './media.guard';

describe('Media Guards', () => {
    let devicesGuard: MediaGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [MediaGuard],
        });
        devicesGuard = TestBed.inject(MediaGuard);
    });

    describe('canActivate', () => {
        it('should return an Observable<boolean>', () => {
            devicesGuard.canActivate().subscribe(response => {
                expect(response).toEqual(true);
            });
        });
    });
});
