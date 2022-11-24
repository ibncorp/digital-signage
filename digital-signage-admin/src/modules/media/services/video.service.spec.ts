import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { VideoService } from './video.service';

describe('VideoService', () => {
    let videoService: VideoService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VideoService, DecimalPipe],
        });
        videoService = TestBed.inject(VideoService);
    });

    describe('video_list$', () => {
        it('should return Observable<Country[]>', () => {
            videoService.video_list$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});
