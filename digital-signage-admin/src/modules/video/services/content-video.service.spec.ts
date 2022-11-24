import { TestBed } from '@angular/core/testing';

import { ContentVideoService } from './content-video.service';

describe('ContentVideoService', () => {
    let contentVideoService: ContentVideoService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ContentVideoService],
        });
        contentVideoService = TestBed.inject(ContentVideoService);
    });

    describe('video_list$', () => {
        it('should return Observable<Country[]>', () => {
            contentVideoService.video_list$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});
