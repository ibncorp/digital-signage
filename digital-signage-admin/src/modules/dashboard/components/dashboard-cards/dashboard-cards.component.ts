import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '@modules/api/api.service';

@Component({
    selector: 'sb-dashboard-cards',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard-cards.component.html',
    styleUrls: ['dashboard-cards.component.scss'],
})
export class DashboardCardsComponent implements OnInit {
    
    activeDevice: number = 0;
    totalDevice: number = 0;

    activeOutlet: number = 0;
    totalOutlet: number = 0;

    activePicture: number = 0;
    totalPicture: number = 0;

    activeVideo: number = 0;
    totalVideo: number = 0;

    activeMenuContent: number = 0;
    totalMenuContent: number = 0;

    activePromoContent: number = 0;
    totalPromoContent: number = 0;

    activeVideoContent: number = 0;
    totalVideoContent: number = 0;

    constructor(
        private apiService: ApiService,
        private changeDet: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.apiService.read('device').subscribe(
            result => {
                if(result.error == false){
                    this.activeDevice = result.results.data.length;
                    this.totalDevice = result.results.data.length;

                    this.changeDet.detectChanges();
                }
            }
        )

        this.apiService.read('outlet').subscribe(
            result => {
                if(result.error == false){
                    this.activeOutlet = result.results.data.length;
                    this.totalOutlet = result.results.data.length;

                    this.changeDet.detectChanges();
                }
            }
        )

        this.apiService.read('media', { type:'1' } ).subscribe(
            result => {
                if(result.error == false){
                    this.activePicture = result.results.data.length;
                    this.totalPicture = result.results.data.length;

                    this.changeDet.detectChanges();
                }
            }
        )

        this.apiService.read('media', { type:'2' } ).subscribe(
            result => {
                if(result.error == false){
                    this.activeVideo = result.results.data.length;
                    this.totalVideo = result.results.data.length;

                    this.changeDet.detectChanges();
                }
            }
        )

        this.apiService.read('content', { type:'1' } ).subscribe(
            result => {
                if(result.error == false){
                    this.activeMenuContent = result.results.data.length;
                    this.totalMenuContent = result.results.data.length;

                    this.changeDet.detectChanges();
                }
            }
        )

        this.apiService.read('content', { type:'2' } ).subscribe(
            result => {
                if(result.error == false){
                    this.activePromoContent = result.results.data.length;
                    this.totalPromoContent = result.results.data.length;

                    this.changeDet.detectChanges();
                }
            }
        )

        this.apiService.read('content', { type:'3' } ).subscribe(
            result => {
                if(result.error == false){
                    this.activeVideoContent = result.results.data.length;
                    this.totalVideoContent = result.results.data.length;

                    this.changeDet.detectChanges();
                }
            }
        )
    }
}
