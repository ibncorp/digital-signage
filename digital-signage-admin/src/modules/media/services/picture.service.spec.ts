import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { PictureService } from './picture.service';

describe('PictureService', () => {
    let pictureService: PictureService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PictureService, DecimalPipe],
        });
        pictureService = TestBed.inject(PictureService);
    });

    describe('picture_list$', () => {
        it('should return Observable<Country[]>', () => {
            pictureService.picture_list$.subscribe(response => {
                expect(response).toBeDefined();
            });
        });
    });
});
