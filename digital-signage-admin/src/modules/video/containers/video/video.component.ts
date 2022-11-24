import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '@modules/devices/models';
import { DeviceService } from '@modules/devices/services';
import { Media } from '@modules/media/models';
import { VideoService } from '@modules/media/services';
import { Video } from '@modules/video/models';
import { ContentVideoService } from '@modules/video/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-content-video',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss'],
})

// Test
export class VideoComponent implements OnInit {
    
    isEdit = false;
    isDetail = false;
    isReadonly = false;

    videoForm: FormGroup | undefined;
      
    picture_list!: Media[];
    device_list!: Device[];

    title = 'Video List';

    selectedVideo!: Video;

    imageSrc!: string;

    apiUrl = environment.API_URL;

    constructor(
        private formBuilder: FormBuilder,
        private deviceService: DeviceService,
        private videoService: VideoService, 
        private contentVideoService: ContentVideoService,
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit() {
        this.spinner.show();

        this.videoForm = this.formBuilder.group({
            deviceId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
        });

        this.deviceService.getDataByType('3').subscribe(
            (result) => {
                this.device_list = result.results.data;
            }
        );

        this.videoService.getData().subscribe(
            (result) => {
                this.picture_list = result.results.data;
            }
        );

        this.videoService.loading$.subscribe(
            (isLoading) => {
                if(!isLoading) this.spinner.hide();
            }
        );
    }

    openModal(content: any, data: any) {

        this.modalService.open(content).result.then((result) => {

            if(result){
                this.contentVideoService.deleteData(data?.id).subscribe(
                    (result: { error: boolean; }) => {
                        if(result?.error == false){
                            this.contentVideoService.loadData();
                        }
                    }
                );
            }
        });
    }

    onMediaSelected(){
        this.picture_list.forEach( media => {
            if (media.id == this.videoForm?.value['mediaId']){
                this.imageSrc = this.apiUrl + 'media/download/' + media.fileName;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    add(){
        this.imageSrc = '';
        this.isDetail = true;      

        this.videoForm = this.formBuilder.group({
            deviceId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
        });
    }
    back(){
        this.isDetail = false;
    }

    save(){
        this.isDetail = false;

        const data = this.videoForm?.value

        data.status = 2;
        data.type = 3;

        if(this.isEdit){
            this.contentVideoService.updateData(this.selectedVideo.id, data)?.subscribe(
                (result) => {
                    this.contentVideoService.loadData();
                }
            );
        }else{
            this.contentVideoService.insertData(data).subscribe(
                (result) => {
                    this.contentVideoService.loadData();
                }
            );
        }
    }

    edit(data: Video){

        this.selectedVideo = data;

        this.imageSrc = this.apiUrl + 'media/download/' + this.selectedVideo.media.fileName;

        this.isReadonly = false;
        this.isEdit = true;
        this.isDetail = true;
        this.title = 'Edit Video';
        
        this.videoForm = this.formBuilder.group({
            deviceId: new FormControl({value: data.device.id, disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: data.media.id, disabled: this.isReadonly}, [Validators.required]),
        });
    }

    view(data: Video){     
        
        this.selectedVideo = data;

        this.imageSrc = environment.API_URL + 'media/download/' + this.selectedVideo.media.fileName;

        this.isReadonly = true;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'View Video';

        this.videoForm = this.formBuilder.group({
            deviceId: new FormControl({value: data.device.id, disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: data.media.id, disabled: this.isReadonly}, [Validators.required]),
        });
    }
}
