import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '@modules/devices/models';
import { DeviceService } from '@modules/devices/services';
import { Media } from '@modules/media/models';
import { PictureService } from '@modules/media/services';
import { Promo } from '@modules/promo/models';
import { PromoService } from '@modules/promo/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-promo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './promo.component.html',
    styleUrls: ['promo.component.scss'],
})


export class PromoComponent implements OnInit {
    
    isEdit = false;
    isDetail = false;
    isReadonly = false;

    promoForm: FormGroup | undefined;
      
    picture_list!: Media[];
    device_list!: Device[];

    title = 'Promo List';

    selectedPromo!: Promo;

    imageSrc!: string;

    apiUrl = environment.API_URL;

    constructor(
        private formBuilder: FormBuilder,
        private deviceService: DeviceService,
        private pictureService: PictureService, 
        private promoService: PromoService,
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: NgbModal,        
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit() {
        this.spinner.show();

        this.promoForm = this.formBuilder.group({
            deviceId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
        });

        this.deviceService.getDataByType('2').subscribe(
            (result) => {
                this.device_list = result.results.data;
            }
        );

        this.pictureService.getData().subscribe(
            (result) => {
                this.picture_list = result.results.data;
            }
        );

        this.promoService.loading$.subscribe(
            (isLoading) => {
                if(!isLoading) this.spinner.hide();
            }
        );
    }

    openModal(content: any, data: any) {

        this.modalService.open(content).result.then((result) => {

            if(result){
                this.promoService.deleteData(data?.id).subscribe(
                    (result: { error: boolean; }) => {
                        if(result?.error == false){
                            this.promoService.loadData();
                        }
                    }
                );
            }
        });
    }

    onMediaSelected(){
        this.picture_list.forEach( media => {
            if (media.id == this.promoForm?.value['mediaId']){
                this.imageSrc = this.apiUrl + 'media/download/' + media.fileName;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    add(){
        this.imageSrc = '';
        this.isDetail = true;      

        this.promoForm = this.formBuilder.group({
            deviceId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
        });
    }
    back(){
        this.isDetail = false;
    }

    save(){
        this.isDetail = false;

        const data = this.promoForm?.value

        data.status = 2;
        data.type = 2;

        if(this.isEdit){
            this.promoService.updateData(this.selectedPromo.id, data)?.subscribe(
                (result) => {
                    this.promoService.loadData();
                }
            );
        }else{
            this.promoService.insertData(data).subscribe(
                (result) => {
                    this.promoService.loadData();
                }
            );
        }
    }

    edit(data: Promo){

        this.selectedPromo = data;

        this.imageSrc = this.apiUrl + 'media/download/' + this.selectedPromo.media.fileName;

        this.isReadonly = false;
        this.isEdit = true;
        this.isDetail = true;
        this.title = 'Edit Promo';
        
        this.promoForm = this.formBuilder.group({
            deviceId: new FormControl({value: data.device.id, disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: data.media.id, disabled: this.isReadonly}, [Validators.required]),
        });
    }

    view(data: Promo){     
        
        this.selectedPromo = data;

        this.imageSrc = this.apiUrl + 'media/download/' + this.selectedPromo.media.fileName;

        this.isReadonly = true;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'View Promo';

        this.promoForm = this.formBuilder.group({
            deviceId: new FormControl({value: data.device.id, disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: data.media.id, disabled: this.isReadonly}, [Validators.required]),
        });
    }
}
