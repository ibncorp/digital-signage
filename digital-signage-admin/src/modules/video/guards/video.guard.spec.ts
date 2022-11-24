import { TestBed } from '@angular/core/testing';

import { VideoGuard } from './video.guard';

describe('Video Guards', () => {
    let devicesGuard: VideoGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [VideoGuard],
        });
        devicesGuard = TestBed.inject(VideoGuard);
    });

    describe('canActivate', () => {
        it('should return an Observable<boolean>', () => {
            devicesGuard.canActivate().subscribe(response => {
                expect(response).toEqual(true);
            });
        });
    });
});
