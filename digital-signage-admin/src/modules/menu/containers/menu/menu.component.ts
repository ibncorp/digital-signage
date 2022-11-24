import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '@modules/devices/models';
import { DeviceService } from '@modules/devices/services';
import { Media } from '@modules/media/models';
import { PictureService } from '@modules/media/services';
import { Menu } from '@modules/menu/models';
import { MenuService } from '@modules/menu/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './menu.component.html',
    styleUrls: ['menu.component.scss'],
})


export class MenuComponent implements OnInit {
    
    isEdit = false;
    isDetail = false;
    isReadonly = false;

    menuForm: FormGroup | undefined;
      
    picture_list!: Media[];
    device_list!: Device[];

    title = 'Menu List';

    selectedMenu!: Menu;

    imageSrc!: string;

    apiUrl = environment.API_URL;

    constructor(
        private formBuilder: FormBuilder,
        private deviceService: DeviceService,
        private pictureService: PictureService, 
        private menuService: MenuService,
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit() {
        this.menuForm = this.formBuilder.group({
            deviceId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
        });

        this.spinner.show();
        
        this.deviceService.getDataByType('1').subscribe(
            (result) => {
                this.device_list = result.results.data;
            }
        );

        this.pictureService.getData().subscribe(
            (result) => {
                this.picture_list = result.results.data;
            }
        );

        this.menuService.loading$.subscribe(
            (isLoading) => {
                if(!isLoading) this.spinner.hide();
            }
        );
    }

    openModal(content: any, data: any) {

        this.modalService.open(content).result.then((result) => {

            if(result){
                this.menuService.deleteData(data?.id).subscribe(
                    (result: { error: boolean; }) => {
                        if(result?.error == false){
                            this.menuService.loadData();
                        }
                    }
                );
            }
        });
    }

    onMediaSelected(){
        this.picture_list.forEach( media => {
            if (media.id == this.menuForm?.value['mediaId']){
                this.imageSrc = this.apiUrl + 'media/download/' + media.fileName;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    add(){
        this.imageSrc = '';
        this.isDetail = true;      

        this.title = 'Add Menu';

        this.menuForm = this.formBuilder.group({
            deviceId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
        });
    }
    back(){
        this.isDetail = false;
        this.title = 'Menu List';
    }

    save(){
        this.isDetail = false;

        const data = this.menuForm?.value

        data.status = 2;
        data.type = 1;

        if(this.isEdit){
            this.menuService.updateData(this.selectedMenu.id, data)?.subscribe(
                (result) => {
                    this.menuService.loadData();
                }
            );
        }else{
            this.menuService.insertData(data).subscribe(
                (result) => {
                    this.menuService.loadData();
                }
            );
        }

        this.title = 'Menu List';
    }

    edit(data: Menu){

        this.selectedMenu = data;

        this.imageSrc = this.apiUrl + 'media/download/' + this.selectedMenu.media.fileName;

        this.isReadonly = false;
        this.isEdit = true;
        this.isDetail = true;
        this.title = 'Edit Menu';
        
        this.menuForm = this.formBuilder.group({
            deviceId: new FormControl({value: data.device.id, disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: data.media.id, disabled: this.isReadonly}, [Validators.required]),
        });
    }

    view(data: Menu){     
        
        this.selectedMenu = data;

        this.imageSrc = this.apiUrl + 'media/download/' + this.selectedMenu.media.fileName;

        this.isReadonly = true;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'View Menu';

        this.menuForm = this.formBuilder.group({
            deviceId: new FormControl({value: data.device.id, disabled: this.isReadonly}, [Validators.required]),
            mediaId: new FormControl({value: data.media.id, disabled: this.isReadonly}, [Validators.required]),
        });
    }
}
