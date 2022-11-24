import { TestBed } from '@angular/core/testing';

import { OutletsGuard } from './outlets.guard';

describe('Outlets Guards', () => {
    let outletsGuard: OutletsGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [OutletsGuard],
        });
        outletsGuard = TestBed.inject(OutletsGuard);
    });

    describe('canActivate', () => {
        it('should return an Observable<boolean>', () => {
            outletsGuard.canActivate().subscribe(response => {
                expect(response).toEqual(true);
            });
        });
    });
});
